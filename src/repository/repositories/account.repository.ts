import { Injectable } from '@nestjs/common';
import { Account } from '../schema/account.entity';
import { RepositoryBase } from './es-base.repository';

@Injectable()
export class AccountRepository extends RepositoryBase<Account> {

  getDocumentId(document: Account) {
    return document._id;
  }

  getType(): string {
    return 'account';
  }

  newObject(): Account {
    return new Account();
  }
}
