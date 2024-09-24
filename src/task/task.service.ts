import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import dayjs from 'dayjs';
import { Meeting } from 'src/meeting/schema/meeting.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from 'src/users/schema/user.schema';
import { MeetingUpcomingEvent } from 'src/meeting/events/meeting-upcoming-event';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<Meeting>,
    @InjectModel(User.name) private userModel: Model<User>, // Injetando o modelo User
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkMeetingsAndSendReminder() {
    const now = dayjs();
    const fifteenMinutesFromNow = now.add(15, 'minute').toDate();

    const meetings = await this.meetingModel
      .find({
        date: { $gte: now.toDate(), $lte: fifteenMinutesFromNow },
        reminderSent: false, // Filtrar reuniões que ainda não enviaram lembrete
      })
      .exec();

    if (meetings.length === 0) {
      this.logger.debug('Nenhuma reunião próxima para os próximos 15 minutos.');
      return;
    }

    this.logger.debug(
      `${meetings.length} reuniões vão começar nos próximos 15 minutos.`,
    );

    for (const meeting of meetings) {
      const attendeesEmails = await this.getAttendeesEmails(meeting.attendees);
      const meetingUpcomingEvent = new MeetingUpcomingEvent(
        meeting.title,
        meeting.date,
        attendeesEmails,
      );

      this.eventEmitter.emit('meeting.upcoming', meetingUpcomingEvent);

      await this.meetingModel.updateOne(
        { _id: meeting._id },
        { $set: { reminderSent: true } },
      );
    }
  }

  private async getAttendeesEmails(
    attendees: Types.ObjectId[],
  ): Promise<string[]> {
    const users = await this.userModel
      .find({
        _id: { $in: attendees },
      })
      .select('email')
      .exec();

    return users.map((user) => user.email);
  }
}
