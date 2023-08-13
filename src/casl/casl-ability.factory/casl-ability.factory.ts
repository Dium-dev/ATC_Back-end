import {
  PureAbility,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { User } from '../../users/entities/user.entity';
import { Action } from './actions';
import { Injectable } from '@nestjs/common';

type Subject = InferSubjects<typeof User> | 'all';
type AppAbility = PureAbility<[Action, Subject]>;

interface UserPayload {
  sub: string;
  username: string;
}

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserPayload) {
    const { can, cannot, build } = new AbilityBuilder<
    PureAbility<[Action, Subject]>
    >(PureAbility as AbilityClass<AppAbility>);

    if (user.sub) {
      can(Action.Update, User, ['firstName', 'lastName', 'email', 'phone'], {
        id: user.sub,
      }); // read-write access to everything
    }

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subject>,
    });
  }
}
