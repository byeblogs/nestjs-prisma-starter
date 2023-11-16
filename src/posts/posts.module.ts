import { Module } from '@nestjs/common';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { GqlThrottlerGuard } from 'src/auth/gql-throttler.guard';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule
  ],
  providers: [
    PostsService, 
    PostsResolver,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
})
export class PostsModule {}