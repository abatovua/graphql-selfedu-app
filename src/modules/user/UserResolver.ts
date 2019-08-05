import { Arg, Field, InputType, Mutation, Query, Resolver, ArgsType, Args, Int, ID } from 'type-graphql';
import { IsAlpha, IsOptional } from 'class-validator';

import { MaybeNull } from '~/types';
import { User } from './UserEntity';
import { UserService } from './UserService';

@ArgsType()
export class GetUsersArgs {
  @Field({ nullable: true })
  @IsOptional()
  @IsAlpha()
  search?: string;

  @Field(type => Int, { nullable: true, defaultValue: 0 })
  skip: number;

  @Field(type => Int, { nullable: true, defaultValue: 10 })
  take: number;
}

@InputType()
export class CreateUserPayload {
  @Field()
  @IsAlpha()
  firstName: string;

  @Field()
  @IsAlpha()
  lastName: string;
}

@InputType()
class UpdateUserPayload {
  @Field(type => ID)
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsAlpha()
  firstName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsAlpha()
  lastName?: string;
}

@Resolver(of => User)
export class UsersResolver {
  private readonly service: UserService;

  constructor() {
    this.service = new UserService();
  }

  // queries
  @Query(type => [User])
  async users(@Args() { search, skip, take }: GetUsersArgs): Promise<User[]> {
    return this.service.find({ search, skip, take });
  }

  @Query(type => User, { nullable: true })
  async user(@Arg('id', type => ID) id: string): Promise<MaybeNull<User>> {
    return this.service.findOneById(id);
  }

  // mutations
  @Mutation(type => User)
  async createUser(@Arg('payload') payload: CreateUserPayload): Promise<User> {
    return this.service.create(payload);
  }

  @Mutation(type => User, { nullable: true })
  async updateUser(@Arg('payload') { id, firstName, lastName }: UpdateUserPayload): Promise<MaybeNull<User>> {
    return this.service.update(id, { firstName, lastName });
  }
}
