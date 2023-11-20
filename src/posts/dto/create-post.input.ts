import { IsNotEmpty } from 'class-validator';
import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { PostStatus } from './status.post';

registerEnumType(PostStatus, {
  name: 'PostStatus',
  description: 'Status of Post',
});

@InputType()
export class CreatePostInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsNotEmpty()
  status: PostStatus;
}
