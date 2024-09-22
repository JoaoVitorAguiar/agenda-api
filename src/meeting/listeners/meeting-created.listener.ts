import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateMeetingEvent } from '../events/meeting-created.event';

@Injectable()
export class MeetingCreatedListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent('meeting.created')
  async handleMeetingCreatedEvent(event: CreateMeetingEvent) {
    await this.emailService.sendMail({
      to: event.attendees,
      subject: 'New Meeting Created',
      text: `A new meeting has been created: ${event.name}`,
      html: `<p>A new meeting has been created: <strong>${event.description}</strong></p>
             <p>The meeting is scheduled for: <strong>${event.date}</strong></p>`,
    });

    console.log('Email sent successfully to:', event.attendees);
  }
}
