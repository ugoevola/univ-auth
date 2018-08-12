import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AccountEntity } from '../schema/account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccountMongoRepository {

  constructor(@InjectRepository(AccountEntity)
  private readonly pageRepository: Repository<AccountEntity>) {
  }

  public getBaseRepository() {
    return this.pageRepository;
  }
}

