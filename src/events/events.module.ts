import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schema/event.schema';
import { EventController } from './events.controller';
import { UsersModule } from 'src/users/users.module';
import { EventCreatedListener } from './listeners/event-created.listener';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    UsersModule,
    EmailModule,
  ],
  controllers: [EventController],
  providers: [EventService, EventCreatedListener],
})
export class EventsModule {}
