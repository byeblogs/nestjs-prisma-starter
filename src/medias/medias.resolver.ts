import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MediasService } from './medias.service';
import CreateMediaInput from './dto/create-media.input';
import { UpdateMediaInput } from './dto/update-media.input';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { PrismaService } from 'nestjs-prisma';
import { Media } from './entities/media.entity';
import { uploadFileStream } from 'src/utils/upload';
import { join } from 'path';

@Resolver('Media')
export class MediasResolver {
  constructor(
    private prisma: PrismaService,
    private readonly mediasService: MediasService
  ) {}
  
  @Mutation(() => Boolean)
  async singleUpload(
    @Args('createMediaInput') createMediaInput: CreateMediaInput,
  ) {
    return this.mediasService.singleUpload(createMediaInput);
  }
}
