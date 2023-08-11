import { SetMetadata } from '@nestjs/common';
import { Action, Subject } from 'src/casl/casl-ability.factory/casl-ability.factory';

export interface Permiss {
  action: Action,
  subject: Subject
}

export const PERMISS_KEY = 'permisses';

export const Permisses = (...permisses: Permiss[]) => SetMetadata(PERMISS_KEY, permisses);