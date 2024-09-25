  import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Request,
    UseGuards,
  } from '@nestjs/common';
  import { AddAttendeeDto } from './dto/add-attendee.sto';
  import { AuthGuard } from 'src/auth/auth.guard';
  import { MeetingService } from './meeting.service';
  import { CreateMeetingDto } from './dto/create-meeting.dto';

  @Controller('meeting')
  export class MeetingController {
    constructor(private readonly meetingService: MeetingService) {}

    @Get()
    async findAll() {
      return await this.meetingService.findAll();
    }

    @UseGuards(AuthGuard)
    @Post()
    async createMeeting(
      @Request() req,
      @Body() createMeetingDto: CreateMeetingDto,
    ) {
      createMeetingDto.createdBy = req.user.sub;
      return this.meetingService.createMeeting(createMeetingDto);
    }

    @Put('attendees')
    async addAttendee(@Body() addAttendeeDto: AddAttendeeDto) {
      return this.meetingService.addAttendee(addAttendeeDto);
    }

    @UseGuards(AuthGuard)
    @Get('my-meetings')
    async findMyMeetings(@Request() req) {
      const userId = req.user.sub; 
      const meetings = await this.meetingService.findByUserId(userId);
      return meetings
    }

    @UseGuards(AuthGuard)
    @Get('invited-meetings')
    async findInvitedEvents(@Request() req) {
      const userId = req.user.sub;
      const meetings = await this.meetingService.findInvitedEventsByUserId(userId);
      return meetings
    } 
  }
