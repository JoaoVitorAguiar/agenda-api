import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Meeting, MeetingSchema } from './schema/meeting.schema';
import { UsersModule } from 'src/users/users.module';
import { EmailModule } from 'src/email/email.module';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { MeetingCreatedListener } from './listeners/meeting-created.listener';
import { MeetingUpcomingListener } from './listeners/meeting-upcoming-listener';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meeting.name, schema: MeetingSchema }]),
    UsersModule,
    EmailModule,
  ],
  controllers: [MeetingController],
  providers: [MeetingService, MeetingCreatedListener, MeetingUpcomingListener],
})
export class MeetingModule {}
