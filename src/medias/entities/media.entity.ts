import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { BaseModel } from 'src/common/entities/base.entity';
import { MediaStatus, MediaType } from '@prisma/client';
import { pathFinderMiddleware } from 'src/middleware/pathFinderMiddleware';

// registerEnumType(MediaStatus, {
//     name: 'MediaStatus',
//     description: 'Status of media',
// });

// registerEnumType(MediaType, {
//     name: 'MediaType',
//     description: 'Type of media',
// });

@ObjectType()
export class Media extends BaseModel {
  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field()
  path: string;

  @Field()
  filename: string;

  @Field({description: 'fullpath of file', middleware: [pathFinderMiddleware]})
  fullpath: string;

  @Field(() => String, { nullable: false })
  status: MediaStatus;

  @Field(() => String, { nullable: false })
  type: MediaType;
}
