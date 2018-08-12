import { Module } from '@nestjs/common';

import { AccountRepository } from './repositories/account.repository';

const repositories  = [
  AccountRepository,
];

@Module({
  imports: [],
  providers: [...repositories],
  exports : [...repositories]
})
export class RepositoryModule { }
