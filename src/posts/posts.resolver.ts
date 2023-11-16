import { PrismaService } from 'nestjs-prisma';
import {
  Resolver,
  Query,
  Parent,
  Args,
  ResolveField,
  Mutation,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { PostIdArgs } from './args/post-id.args';
import { UserIdArgs } from './args/user-id.args';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { PostsService } from './posts.service';
import { ListPostResponse } from './dto/list-post.response';
import { ListPostInput } from './dto/list-post.input';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/roles.guard';
import { GqlThrottlerGuard } from 'src/auth/gql-throttler.guard';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private prisma: PrismaService,
    private postsService: PostsService
  ) {}

  @Mutation(() => Post)
  async createPost(
    @UserEntity() user: User,
    @Args('createPostInput') createPostInput: CreatePostInput
  ) {
    return this.postsService.create(user, createPostInput);
  }

  @Roles(Role.User)
  @UseGuards(GqlAuthGuard)
  @Query(() => ListPostResponse)
  listPost(
    @Args('listPostInput') listPostInput: ListPostInput
  ): Promise<ListPostResponse> {
    return this.postsService.list(listPostInput);
  }

  @Query(() => [Post])
  userPosts(@Args() id: UserIdArgs) {
    return this.postsService.userPosts(id);
  }

  @Query(() => Post)
  async post(@Args() id: PostIdArgs) {
    return this.postsService.post(id);
  }

  @ResolveField('user', () => User)
  async user(@Parent() post: Post) {
    return this.prisma.post.findUnique({ where: { id: post.id } }).user();
  }
}
