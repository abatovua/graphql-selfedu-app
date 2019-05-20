import { Arg, Field, InputType, Mutation, Query, Resolver, ArgsType, Args, Int } from 'type-graphql';
import { getMongoRepository, MongoRepository } from 'typeorm';
import { isNil, chain } from 'lodash';

import { User } from '~/entities/user';

@InputType()
export class UserFilter implements Partial<User> {
  @Field({ nullable: true }) firstName?: string;
  @Field({ nullable: true }) lastName?: string;
}

@ArgsType()
class GetUsersArgs {
  @Field({ nullable: true })
  userFilter?: UserFilter;

  @Field(type => Int, { nullable: true, defaultValue: 0 })
  skip?: number;

  @Field(type => Int, { nullable: true, defaultValue: 10 })
  take?: number;
}

@InputType()
export class NewUser implements Partial<User> {
  @Field() firstName: string;
  @Field() lastName: string;
}

@Resolver(of => User)
export class UsersResolver {
  private repository: MongoRepository<User>;

  constructor() {
    this.repository = getMongoRepository(User);
  }

  @Query(type => [User])
  async users(@Args() { userFilter, skip, take }: GetUsersArgs): Promise<User[]> {
    const options = chain(userFilter)
      .pick(['firstName', 'lastName'])
      .omitBy(isNil)
      .mapValues(v => new RegExp(`${v}`, 'i'))
      .value();

    return this.repository.find({ where: options, skip, take });
  }

  @Query(type => User, { nullable: true })
  async user(@Arg('id') userId: string): Promise<User | undefined> {
    return this.repository.findOne(userId);
  }

  @Mutation(type => User)
  async addUser(@Arg('newUser') newUser: NewUser): Promise<User> {
    const user = new User(newUser);
    return this.repository.save(user);
  }
}
