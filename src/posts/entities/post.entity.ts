import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { BaseModel } from 'src/common/entities/base.entity';
import { StatusType } from '../dto/status.type';
import { PostStatus } from '@prisma/client';

@ObjectType()
export class Post extends BaseModel {
  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => StatusType)
  status: PostStatus;
}
