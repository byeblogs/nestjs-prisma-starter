import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class FilterPostInput {
  @Field(() => ID, { nullable: true })
  categoryId?: string;
}
