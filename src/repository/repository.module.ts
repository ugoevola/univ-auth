import { Module } from '@nestjs/common';

import { AccountMongoRepository } from './repositories/account.repository';
import { AccountEntity } from './schema/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

const repositories  = [
  AccountMongoRepository,
];

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  providers: [...repositories],
  exports : [...repositories]
})
export class RepositoryModule { }
