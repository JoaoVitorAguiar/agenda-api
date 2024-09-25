import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { Meeting } from './schema/meeting.schema';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { AddAttendeeDto } from './dto/add-attendee.sto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsersService } from 'src/users/users.service';
import { CreateMeetingEvent } from './events/meeting-created.event';

@Injectable()
export class MeetingService {
  constructor(
    @InjectModel(Meeting.name) private meetingModel: Model<Meeting>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly eventEmitter: EventEmitter2,
    private readonly userServie: UsersService,
  ) {}

  async createMeeting(createMeetingDto: CreateMeetingDto): Promise<Meeting> {
    const { title, description, emails, createdBy, date } = createMeetingDto;

    if (!createdBy) throw new BadRequestException('Autor não informado');
    const author = await this.userServie.findOne(createdBy);

    if (!author) throw new NotFoundException('Usuário não encontrado');

    // Filtrar e-mails únicos
    const emailSet = new Set<string>();
    const uniqueEmails = emails.filter((email) => {
      if (emailSet.has(email)) {
        return false; // Ignora e-mails duplicados
      }
      emailSet.add(email);
      return true;
    });

    const users = await Promise.all(
      uniqueEmails.map((email) =>
        this.userModel
          .findOne({ email })
          .exec()
          .then((user) => user || null),
      ),
    );

    const validUsers = users.filter((user) => user !== null);

    const createdMeeting = new this.meetingModel({
      title,
      description,
      date: date,
      attendees: validUsers.map((user) => user._id),
      createdBy: author.id,
    });
    const savedMeeting = await createdMeeting.save();

    // Emitir o evento
    const createMeetingEvent = new CreateMeetingEvent();
    createMeetingEvent.name = title;
    createMeetingEvent.description = description;
    createMeetingEvent.attendees = validUsers.map((user) => user.email); // Adiciona os e-mails dos participantes
    this.eventEmitter.emit('meeting.created', createMeetingEvent);

    return savedMeeting;
  }

  async addAttendee(addAttendeeDto: AddAttendeeDto): Promise<Meeting> {
    const { meetingId, email } = addAttendeeDto;
    return this.meetingModel
      .findByIdAndUpdate(
        meetingId,
        { $addToSet: { attendees: email } }, // Usa $addToSet para garantir unicidade
        { new: true },
      )
      .exec();
  }

  async findAll(): Promise<Meeting[]> {
    return this.meetingModel.find().exec();
  }

  async findByUserId(userId: string): Promise<Meeting[]> {
    return this.meetingModel.find({ createdBy: userId }).exec();
  }

  async findInvitedEventsByUserId(userId: string): Promise<Meeting[]> {
    const objectId = new Types.ObjectId(userId); // Convertendo para ObjectId
    return this.meetingModel.find({ attendees: objectId }).exec();
  }
  
}
