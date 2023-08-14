import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISS_KEY, Permiss } from 'src/utils/custom/permiss.decorator';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory/casl-ability.factory';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class PermissGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Getting metadata from @Permisses decorator
    const requiredPermisses = this.reflector.getAllAndOverride<Permiss[]>(
      PERMISS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredPermisses.length) {
      return true;
    }
    // user object provided by RolesGuard.
    // user: {sub: user.id, username: user.firstname, rol:user.rol}
    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser(user);

    //Checking if user is authorized
    try {
      requiredPermisses.forEach((permiss) => {
        ForbiddenError.from(ability)
          .setMessage('This user is not authorized to perform this action')
          .throwUnlessCan(permiss.action, permiss.subject);
      });

      return true;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
