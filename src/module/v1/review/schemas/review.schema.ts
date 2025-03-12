import mongoose from 'mongoose';
import { User, UserDocument } from '../../user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Course, CourseDocument } from '../../course/schema/course.schema';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    unique: true,
    index: true,
  })
  user: UserDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Course.name,
    unique: true,
    index: true,
  })
  course: CourseDocument;

  @Prop({ enum: [1, 2, 3, 4, 5], required: true })
  rating: number;

  @Prop()
  comment: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.pre(['find', 'findOne'], function (next) {
  this.where({ isDeleted: false });
  this.populate('course user');

  next();
});
