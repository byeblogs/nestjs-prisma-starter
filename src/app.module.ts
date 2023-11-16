import { GraphQLModule } from '@nestjs/graphql';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PostsModule } from 'src/posts/posts.module';
import config from 'src/common/configs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GqlConfigService } from './gql-config.service';
import {
  FacebookAuthModuleOptions,
  GoogleAuthModuleOptions,
  HybridAuthModule,
} from '@nestjs-hybrid-auth/all';
import { ProductsModule } from './products/products.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { GqlAuthGuard } from './auth/gql-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { GqlThrottlerGuard } from './auth/gql-throttler.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          // configure your prisma middleware
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),
    HybridAuthModule.forRootAsync({
      facebook: {
        useFactory: (
          configService: ConfigService
        ): FacebookAuthModuleOptions => ({
          clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
          clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET'),
          callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL'),
        }),
        inject: [ConfigService],
      },
      google: {
        useFactory: (
          configService: ConfigService
        ): GoogleAuthModuleOptions => ({
          clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
          clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
          callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
        }),
        inject: [ConfigService],
      },
      // Rest of the providers
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('THROTTLE_TTL'),
        limit: configService.get<number>('THROTTLE_LIMIT'),
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    AppResolver,
  ],
})
export class AppModule {}
