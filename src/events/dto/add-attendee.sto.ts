import { IsNotEmpty, IsString } from 'class-validator';

export class AddAttendeeDto {
  @IsNotEmpty({ message: 'Event ID is required' })
  @IsString({ message: 'Event ID must be a string' })
  eventId: string;

  @IsNotEmpty({ message: 'User ID is required' })
  @IsString({ message: 'User ID must be a string' })
  userId: string;
}
