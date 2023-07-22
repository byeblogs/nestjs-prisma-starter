import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SearchPostInput {
  @Field(() => String, { nullable: true })
  keyword?: string;
}
