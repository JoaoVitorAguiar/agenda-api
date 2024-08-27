import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { OnEvent } from '@nestjs/event-emitter';
import { EventCreatedEvent } from '../events/event-created.event';

@Injectable()
export class EventCreatedListener {
  constructor(private readonly emailService: EmailService) {}
  @OnEvent('event.created')
  async handleEventCreatedEvent(event: EventCreatedEvent) {
    await this.emailService.sendMail({
      to: event.attendees,
      subject: 'New Event Created',
      text: `A new event has been created: ${event.name}`,
      html: `<p>A new event has been created: <strong>${event.description}</strong></p>`,
    });

    console.log('Email sent successfully to:', event.attendees);
  }
}
