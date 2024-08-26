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
    const createdEvent = new this.eventModel(createEventDto);
    const savedEvent = await createdEvent.save();
    const eventCreatedEvent = new EventCreatedEvent();
    eventCreatedEvent.name = createEventDto.title;
    eventCreatedEvent.description = createEventDto.description;
    this.eventEmitter.emit('event.created', eventCreatedEvent);
    return savedEvent;
  }

  async addAttendee(addAttendeeDto: AddAttendeeDto): Promise<Event> {
    const { eventId, userId } = addAttendeeDto;
    return this.eventModel
      .findByIdAndUpdate(
        eventId,
        { $push: { attendees: userId } },
        { new: true },
      )
      .exec();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }
}
