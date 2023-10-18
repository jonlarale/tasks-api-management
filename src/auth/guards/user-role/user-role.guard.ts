import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';

import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles) {
      return true;
    }
    if (validRoles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) {
      throw new RpcException({
        error: 'Not Found',
        message: 'User not found',
        statusCode: 404,
      });
    }

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }

    throw new RpcException({
      error: 'Unauthorized',
      message: 'User does not have the required roles',
      statusCode: 401,
    });
  }
}
