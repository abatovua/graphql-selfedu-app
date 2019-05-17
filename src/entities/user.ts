import { Column, Entity, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, ID, Field, GraphQLISODateTime } from 'type-graphql';
import { ObjectID } from 'mongodb';

@Entity()
@ObjectType('User')
export class User {
  @ObjectIdColumn()
  @Field(() => ID)
  id: ObjectID;

  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;

  @CreateDateColumn({ type: 'timestamptz' })
  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}