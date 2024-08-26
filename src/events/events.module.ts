import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schema/event.schema';
import { EventController } from './events.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    UsersModule,
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventsModule {}
