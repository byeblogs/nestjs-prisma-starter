import { IsNotEmpty } from 'class-validator';
import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { StatusType } from './status.type';

registerEnumType(StatusType, {
  name: 'StatusType',
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
  status: StatusType;
}
