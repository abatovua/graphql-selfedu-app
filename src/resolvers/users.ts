import { Arg, Field, InputType, Mutation, Query, Resolver } from 'type-graphql';
import { getMongoRepository, MongoRepository } from 'typeorm';
import { ObjectID, ObjectId } from 'mongodb'
import { omitBy, isNil, pick } from 'lodash'

import { User } from '~/entities/user';

@InputType()
export class NewUser implements Partial<User> {
  @Field() firstName: string;
  @Field() lastName: string;
}

@InputType()
export class UserFilter implements Partial<User> {
  @Field({ nullable: true }) firstName?: string;
  @Field({ nullable: true }) lastName?: string;
}

@Resolver(() => User)
export class UsersResolver {
  private repository: MongoRepository<User>;

  constructor() {
    this.repository = getMongoRepository(User);
  }

  @Query(() => [User])
  async users(
    @Arg('filter', { nullable: true }) userFilter?: UserFilter,
    @Arg('take', { nullable: true }) take: number = 10,
    @Arg('skip', { nullable: true }) skip: number = 0,
  ): Promise<User[]> {
    const options = omitBy(
      pick(userFilter, ['firstName', 'lastName']),
      isNil,
    );

    return await this.repository.find({ ...options, skip, take });
  }

  @Query(() => User, { nullable: true })
  async user(@Arg('id') userId: string): Promise<User | undefined> {
    return await this.repository.findOne({ id: new ObjectId(userId) });
  }

  @Mutation(() => User)
  async addUser(@Arg('user') userData: NewUser): Promise<User> {
    const user = new User()
    user.firstName = userData.firstName
    user.lastName = userData.lastName

    return await this.repository.save(user);
  }
}
