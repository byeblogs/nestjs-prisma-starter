import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { IsNotEmpty } from 'class-validator';
import { Upload } from 'src/common/configs/scalars/upload.scalar';

@InputType()
export default class CreateMediaInput {
  @Field()
  name?: string;

  @Field()
  description?: string;

  @Field(() => [GraphQLUpload])
  files: Upload[];

  @Field(() => Boolean)
  isPublic: boolean;
}
