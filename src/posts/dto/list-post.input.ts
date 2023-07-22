import { PaginationInput } from 'src/common/dto';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { FilterPostInput } from './filter-post.input';
import { SearchPostInput } from './search-post.input';

@InputType()
export class ListPostInput extends PartialType(PaginationInput) {
  @Field(() => FilterPostInput, { nullable: true })
  filter?: FilterPostInput;

  @Field(() => SearchPostInput, { nullable: true })
  search?: SearchPostInput;
}
