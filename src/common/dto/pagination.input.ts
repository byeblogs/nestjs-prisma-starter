import { IsNumber, IsNotEmpty, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PaginationInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  page: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @Max(50)
  @Min(1)
  @Type(() => Number)
  limit: number;
}
