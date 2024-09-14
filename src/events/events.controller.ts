import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { AddAttendeeDto } from './dto/add-attendee.sto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async findAll() {
    return await this.eventService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post()
  async createEvent(@Request() req, @Body() createEventDto: CreateEventDto) {
    createEventDto.createdBy = req.user.sub;
    return this.eventService.createEvent(createEventDto);
  }

  @Put('attendees')
  async addAttendee(@Body() addAttendeeDto: AddAttendeeDto) {
    return this.eventService.addAttendee(addAttendeeDto);
  }
}
