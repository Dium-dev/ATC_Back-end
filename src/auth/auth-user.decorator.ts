import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  console.log(request.user);
  
  if (request.user) {
    return request.user;
  } else {
    return null;
  }
});
