import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskService } from './task.service';
import { Meeting, MeetingSchema } from 'src/meeting/schema/meeting.schema';
import { EmailService } from 'src/email/email.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Habilita o agendamento de tarefas
    MongooseModule.forFeature([{ name: Meeting.name, schema: MeetingSchema }]), // Adiciona o schema Meeting
    UsersModule,
  ],
  providers: [TaskService, EmailService], // TaskService e EmailService
  exports: [TaskService], // Exporta o TaskService
})
export class TaskModule {}
