import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { OnEvent } from '@nestjs/event-emitter';
import { MeetingUpcomingEvent } from '../events/meeting-upcoming-event';

@Injectable()
export class MeetingUpcomingListener {
  private readonly logger = new Logger(MeetingUpcomingListener.name);

  constructor(private readonly emailService: EmailService) {}
  @OnEvent('meeting.upcoming')
  async handleMeetingUpcomingEvent(event: MeetingUpcomingEvent) {
    try {
      await this.emailService.sendMail({
        to: event.attendees,
        subject: `Reminder: Meeting "${event.name}" is starting soon`,
        text: `The meeting "${event.name}" is happening at ${event.date}. Be prepared!`,
        html: `<p>The meeting <strong>"${event.name}"</strong> is scheduled to start soon at <strong>${event.date}</strong>.</p>
               <p>Please be ready to join.</p>`,
      });

      this.logger.debug(
        'Reminder email sent successfully to: ' + event.attendees.join(', '),
      );
    } catch (error) {
      this.logger.error('Failed to send reminder email', error);
    }
  }
}
