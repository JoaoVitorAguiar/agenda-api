import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { EventService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { AddAttendeeDto } from './dto/add-attendee.sto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async findAll() {
    return await this.eventService.findAll();
  }

  @Post()
  async createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
  }

  @Put('attendees')
  async addAttendee(@Body() addAttendeeDto: AddAttendeeDto) {
    return this.eventService.addAttendee(addAttendeeDto);
  }
}
