import { ModelType } from 'typegoose';
import { omitBy, isEmpty, isNil } from 'lodash';

import { MaybeNull } from '~/types';
import { UserModel, User } from './UserEntity';
import logger from '~/logger';

interface IUserFindOptions {
  search?: string;
  skip: number;
  take: number;
}

export class UserService {
  private readonly model: ModelType<User>;

  constructor() {
    this.model = UserModel;
  }

  async find({ search, skip, take }: IUserFindOptions): Promise<User[]> {
    let conditions = {};

    if (search) {
      // partial search by text fields
      conditions = {
        $or: [
          { firstName: { $regex: `^${search}`, $options: 'i' } },
          { lastName: { $regex: `^${search}`, $options: 'i' } },
        ],
      };
    }

    return this.model.find(conditions, null, { skip, take }).exec();
  }

  async findOneById(id: string): Promise<MaybeNull<User>> {
    return this.model.findOne({ _id: id }).exec();
  }

  async create(payload: Partial<User>): Promise<User> {
    return new this.model(payload).save();
  }

  async update(id: string, payload: Partial<User>): Promise<MaybeNull<User>> {
    return this.model.findByIdAndUpdate(id, { $set: omitBy(payload, isNil) }, { new: true }).exec();
  }

  async count(entity: any) {
    return this.model.count(entity);
  }
}
