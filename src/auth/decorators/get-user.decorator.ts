import { createParamDecorator } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;

  if (!user) {
    throw new RpcException({
      error: 'Not Found',
      message: 'User not found',
      statusCode: 404,
    });
  }
  return data ? user[data] : user;
});
