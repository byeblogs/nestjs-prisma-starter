import { Field, Int, ObjectType, PartialType } from '@nestjs/graphql';
import { PaginationResponse } from 'src/common/dto';
import { Post } from '../models/post.model';

@ObjectType()
export class ListPostResponse extends PartialType(PaginationResponse) {
  @Field(() => Int, { nullable: true })
  total: number;

  @Field(() => [Post], { nullable: true })
  posts?: Post[];
}
