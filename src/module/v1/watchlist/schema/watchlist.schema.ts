import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { Course, CourseDocument } from '../../course/schema/course.schema';

export type WatchlistDocument = Watchlist & Document;

@Schema({ timestamps: true })
export class Watchlist {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Course.name,
    autopopulate: true,
  })
  course: CourseDocument;
}

export const WatchlistSchema = SchemaFactory.createForClass(Watchlist);

WatchlistSchema.pre(['find', 'findOne'], function (next) {
  this.populate('course');

  next();
});
