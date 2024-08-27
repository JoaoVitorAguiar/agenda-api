import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  IsMongoId,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsNotEmpty({ message: 'Date is required' })
  @IsDate({ message: 'Date must be a valid date' })
  @Type(() => Date)
  date: Date;

  @IsNotEmpty({ message: 'CreatedBy is required' })
  @IsMongoId({ message: 'CreatedBy must be a valid MongoDB ID' })
  createdBy: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  emails: Array<string>;
}
