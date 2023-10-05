import { Injectable } from '@nestjs/common';
import { MongoService } from './mongo.service';

type Post = {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
};

type Profile = {
  id: number;
  bio: string;
  userId: number;
};

type User = {
  id: number;
  email: string;
  name: string;
};

@Injectable()
export class SyncdbService {
  constructor(private readonly mongoService: MongoService) {}

  async syncPost(post: Post) {
    if (await this.mongoService.post.findUnique({ where: { id: post.id } })) {
      await this.mongoService.post.update({
        where: {
          id: post.id,
        },
        data: {
          title: post.title,
          content: post.content,
          authorId: post.authorId,
        },
      });
    } else {
      await this.mongoService.post.create({
        data: {
          id: post.id,
          title: post.title,
          content: post.content,
          authorId: post.authorId,
        },
      });
    }
  }

  async syncUser(user: User) {
    if (await this.mongoService.user.findUnique({ where: { id: user.id } })) {
      await this.mongoService.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: user.email,
          name: user.name,
        },
      });
    } else {
      await this.mongoService.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    }
  }
}
