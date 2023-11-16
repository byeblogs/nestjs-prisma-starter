import { Injectable, ExecutionContext, CustomDecorator, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationError } from '@nestjs/apollo';
import { Reflector } from '@nestjs/core';
import { Context } from 'vm';
import { AuthService } from './auth.service';

export const IS_PUBLIC_KEY = 'isPublic';
/**
 *
 */
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  /**
   * @param authService
   * @param reflector
   */
  constructor(private authService: AuthService, private reflector: Reflector) {
    super();
  }

  /**
   * @param context
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    
    const ctx = GqlExecutionContext.create(context).getContext();
    const headers = ctx?.req?.headers;
    if (!headers?.authorization) {
      throw new AuthenticationError('You must provide token');
    }
    const user = await this.authService.verify(headers?.authorization);

    ctx.user = user;
    return true;
  }

  /**
   * @param context
   */
  getRequest(context: ExecutionContext): Context {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
