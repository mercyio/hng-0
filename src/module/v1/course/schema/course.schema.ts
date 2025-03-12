import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User, UserDocument } from '../../user/schemas/user.schema';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    unique: true,
    index: true,
  })
  user: UserDocument;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: [{ url: String, _id: String }] })
  images: { url: string; _id: string }[];

  @Prop({ type: [{ url: String, _id: String }] })
  video: { url: string; _id: string }[];

  @Prop()
  price: number;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  totalReviews: number;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

CourseSchema.pre(/^find/, function (next) {
  const isDeletedCondition = this['_conditions']?.isDeleted;
  this['_conditions']['isDeleted'] = { $ne: isDeletedCondition ?? true };

  next();
});

CourseSchema.pre(['find', 'findOne'], function (next) {
  const autopopulate = this.getOptions()?.autopopulate ?? true;

  if (autopopulate) {
    this.populate('user');
  }

  next();
});
