import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventCreatedEvent } from '../events/event-created.event';

@Injectable()
export class EventCreatedListener {
  @OnEvent('event.created')
  handleEventCreatedEvent(event: EventCreatedEvent) {
    console.log(event); // Verifique se o evento está sendo impresso no console
  }
}
