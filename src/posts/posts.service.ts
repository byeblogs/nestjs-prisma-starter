import { Injectable } from '@nestjs/common';
import { Subscription } from '@nestjs/graphql';
import { PrismaService } from 'nestjs-prisma';
import { Post } from './models/post.model';
import { PubSub } from 'graphql-subscriptions';
import { CreatePostInput } from './dto/create-post.input';
import { User } from 'src/users/models/user.model';
import { UserIdArgs } from './args/user-id.args';
import { PostIdArgs } from './args/post-id.args';
import { ListPostInput } from './dto/list-post.input';
import { ListPostResponse } from './dto/list-post.response';

const pubSub = new PubSub();

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  @Subscription(() => Post)
  postCreated() {
    return pubSub.asyncIterator('postCreated');
  }

  create(user: User, createPostInput: CreatePostInput) {
    const newPost = this.prisma.post.create({
      data: {
        published: true,
        title: createPostInput.title,
        content: createPostInput.content,
        authorId: user.id,
      },
    });
    pubSub.publish('postCreated', { postCreated: newPost });
    return newPost;
  }

  async list(listPostInput: ListPostInput): Promise<ListPostResponse> {
    try {
      const { limit, page } = listPostInput;

      const total = await this.prisma.post.count({
        where: {
          published: true,
        },
      });
      const posts = await this.prisma.post.findMany({
        include: { author: true },
        where: {
          published: true,
        },
        take: limit,
        skip: page * limit,
      });
      return {
        total,
        posts,
      };
    } catch (err) {
      throw err;
    }
  }

  userPosts(id: UserIdArgs) {
    return this.prisma.user
      .findUnique({ where: { id: id.userId } })
      .posts({ where: { published: true } });
    // or
    // return this.prisma.posts.findMany({
    //   where: {
    //     published: true,
    //     author: { id: id.userId }
    //   }
    // });
  }

  post(id: PostIdArgs) {
    return this.prisma.post.findUnique({ where: { id: id.postId } });
  }
}
