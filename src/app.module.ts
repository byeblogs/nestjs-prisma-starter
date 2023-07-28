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
import { FacebookAuthModuleOptions, GoogleAuthModuleOptions, HybridAuthModule } from '@nestjs-hybrid-auth/all';

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
    AuthModule,
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
