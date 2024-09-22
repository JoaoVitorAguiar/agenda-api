import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddAttendeeDto {
  @IsNotEmpty({ message: 'Event ID is required' })
  @IsString({ message: 'Event ID must be a string' })
  meetingId: string;

  @IsEmail()
  email: string;
}
