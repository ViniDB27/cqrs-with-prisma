import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { PostgreService } from '../prisma/postgre.service';
import { MongoService } from '../prisma/mongo.service';
import { SyncdbService } from '../prisma/syncdb.service';

@Injectable()
export class UserService {
  constructor(
    private readonly postgreService: PostgreService,
    private readonly mongoService: MongoService,
    private readonly syncdbService: SyncdbService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.postgreService.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
      },
    });

    this.syncdbService.syncUser(user);

    return user;
  }

  findAll() {
    return this.mongoService.user.findMany({
      include: {
        profile: true,
        posts: true,
      },
    });
  }

  findOne(id: number) {
    return this.mongoService.user.findUnique({
      where: {
        id,
      },
      include: {
        profile: true,
        posts: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.postgreService.user.update({
      where: {
        id,
      },
      data: {
        email: updateUserDto.email,
        name: updateUserDto.name,
      },
    });

    this.syncdbService.syncUser(user);

    return user;
  }
}
