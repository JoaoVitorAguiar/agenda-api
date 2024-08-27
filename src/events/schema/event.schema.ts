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

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'User' }],
    set: (attendees: Types.ObjectId[]) =>
      Array.from(new Set(attendees.map((id) => id.toString()))).map(
        (id) => new Types.ObjectId(id),
      ),
  })
  attendees: User[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
