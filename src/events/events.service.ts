import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { AddAttendeeDto } from './dto/add-attendee.sto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventCreatedEvent } from './events/event-created.event';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const { title, description, emails } = createEventDto;
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
          .then((user) => (user ? user : null)),
      ),
    );

    const validUsers = users.filter((user) => user !== null);

    const createdEvent = new this.eventModel({
      ...createEventDto,
      attendees: validUsers.map((user) => user._id),
    });
    const savedEvent = await createdEvent.save();

    // Emitir evento
    const eventCreatedEvent = new EventCreatedEvent();
    eventCreatedEvent.name = title;
    eventCreatedEvent.description = description;
    this.eventEmitter.emit('event.created', eventCreatedEvent);

    return savedEvent;
  }

  async addAttendee(addAttendeeDto: AddAttendeeDto): Promise<Event> {
    const { eventId, email } = addAttendeeDto;
    return this.eventModel
      .findByIdAndUpdate(
        eventId,
        { $addToSet: { attendees: email } }, // Usa $addToSet para garantir unicidade
        { new: true },
      )
      .exec();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }
}
