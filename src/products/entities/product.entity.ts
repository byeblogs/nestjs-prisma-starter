import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { ProductStatus } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

registerEnumType(ProductStatus, {
  name: 'ProductStatus',
  description: 'Status of product',
});

@ObjectType()
export class Product {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @Field(() => ProductStatus)
  status: ProductStatus;
}
