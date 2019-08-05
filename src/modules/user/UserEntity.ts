import { ObjectType, ID, Field } from 'type-graphql';
import { prop, Typegoose } from 'typegoose';
import { ObjectId } from 'mongodb';

@ObjectType()
export class User extends Typegoose {
  @Field(() => ID)
  get id(): ObjectId {
    return this._id;
  }

  @prop({ required: true })
  @Field()
  firstName: string;

  @prop({ required: true })
  @Field()
  lastName: string;

  @Field(() => Date)
  readonly createdAt: Date;

  @Field(() => Date)
  readonly updatedAt: Date;

  readonly _id: ObjectId;
}

export const UserModel = new User().getModelForClass(User, {
  schemaOptions: { timestamps: true },
});
