import { AuthenticationError } from '@nestjs/apollo';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { AuthService } from './auth.service';
import { Context } from 'vm';

@Injectable()
export class RolesGuard implements CanActivate {
  /**
   * @param authService
   * @param reflector
   */
  constructor(private authService: AuthService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context).getContext();
    const headers = ctx?.req?.headers;
    if (!headers?.authorization) {
      throw new AuthenticationError('You must provide token');
    }
    const user = await this.authService.verify(headers?.authorization);

    if (user) {
      return requiredRoles.includes(user.role);
    } else {
      return false;
    }
  }

  /**
   * @param context
   */
  getRequest(context: ExecutionContext): Context {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
