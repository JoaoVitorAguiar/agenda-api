import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { AddAttendeeDto } from './dto/add-attendee.sto';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const createdEvent = new this.eventModel(createEventDto);
    return createdEvent.save();
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
