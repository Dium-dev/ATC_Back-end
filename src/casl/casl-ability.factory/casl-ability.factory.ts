import {
  PureAbility,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { User } from '../../users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Rol } from '../../users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';

interface UserPayload {
  sub: string;
  username: string;
  rol: Rol;
}

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Delete = 'delete',
  Update = 'update',
  Get = 'get',
  Patch = 'patch',
}

export type Subject = InferSubjects<typeof User | typeof Product> | 'all';
type AppAbility = PureAbility<[Action, Subject]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserPayload) {
    const { can, cannot, build } = new AbilityBuilder<
      PureAbility<[Action, Subject]>
    >(PureAbility as AbilityClass<AppAbility>);

    //Permisses
    if (user.sub) {
      can(Action.Update, User, ['firstName', 'lastName', 'email', 'phone'], {
        id: user.sub,
      }); // read-write access to everything
    }

    //detectSubjectType es para detectar el tipado de un subject como lo
    //podría ser la entidad Product o User
    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subject>,
    });
  }
}
