import { Injectable, BadRequestException } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User } from './users/entities/user.entity';
import { ShoppingCart } from './shopping-cart/entities/shopping-cart.entity';

@Injectable()
export class AppService {
  constructor(private sequelizeInit: Sequelize) {}

  getHello(): string {
    return 'Hello World!';
  }

  /* async postPrueba(algo: any): Promise<void> {
    const transaction: Transaction = await this.sequelizeInit.transaction()
    try {

      const newUser = await User.create(algo, { transaction })

      const newShopCart = await ShoppingCart.create({ userId: newUser.id }, { transaction })

      transaction.commit()
      transaction.afterCommit(() => {
        console.info('todo bien !')
      })
      return;
    } catch (error) {
      transaction.rollback()
      throw new BadRequestException('no se pudo hacer su operación')
    }
  } */
}
