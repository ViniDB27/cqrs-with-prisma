import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostgreService } from '../prisma/postgre.service';
import { MongoService } from '../prisma/mongo.service';
import { SyncdbService } from '../prisma/syncdb.service';

@Injectable()
export class PostService {
  constructor(
    private readonly postgreService: PostgreService,
    private readonly mongoService: MongoService,
    private readonly syncdbService: SyncdbService,
  ) {}
  async create(createPostDto: CreatePostDto) {
    const post = await this.postgreService.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        authorId: +createPostDto.authorId,
      },
    });

    this.syncdbService.syncPost(post);

    return post;
  }

  findAll() {
    return this.mongoService.post.findMany({
      include: {
        author: true,
      },
    });
  }

  findOne(id: number) {
    return this.mongoService.post.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postgreService.post.update({
      where: {
        id,
      },
      data: {
        title: updatePostDto.title,
        content: updatePostDto.content,
        authorId: +updatePostDto.authorId,
      },
    });

    this.syncdbService.syncPost(post);
    return post;
  }
}
