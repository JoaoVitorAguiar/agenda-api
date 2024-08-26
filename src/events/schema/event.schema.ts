import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schema/user.schema';

@Schema()
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  attendees: User[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
