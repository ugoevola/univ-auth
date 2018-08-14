import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { WinLogger } from '../common/logger/winlogger';
import { Config } from '../config/config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AccountMongoRepository } from '../repository/repositories/account.repository';
import { FunctionalException } from '../common/exception/functional.exception';
import { AccountEntity } from '../repository/schema/account.entity';
import { BaseService } from './base.service';

@Injectable()
export class AuthenticationService extends BaseService<AccountEntity> {

  private logger: WinLogger = WinLogger.get('authentification-service');

  constructor(private readonly accountRepository: AccountMongoRepository) {
    super(accountRepository.getBaseRepository());
  }

  public async authenticate(email: string, password: string): Promise<string> {

    let account;
    const adminAccount = Config.get().ADMIN_ACCOUNT;
    if (email === adminAccount) {
      account = {
        email: adminAccount,
        givenName: 'admin',
        role: 'ADMIN',
        password: bcrypt.hashSync(Config.get().ADMIN_PWD, 10)
      };
    } else {
      account = await this.accountRepository.getBaseRepository().findOne({ email: email });
    }

    let jwtToken: string;
    if (account) {
      const loginDate = new Date();
      account.lastLoginAttempt = loginDate;
      if (bcrypt.compareSync(password, account.password)) {
        jwtToken = jwt.sign({
          email: account.email,
          givenName: account.givenName,
          role: account.role
        }, Config.get().AUTH_JWT_KEY, { expiresIn: 3600 });

        this.logger.debug(`Token generated for user ${email}`);

        account.lastLoginSuccessful = loginDate;
      }
      if (account.email !== Config.get().ADMIN_ACCOUNT) {
        await this.accountRepository.getBaseRepository().save(account);
      }
    }
    return jwtToken;
  }

  public async create(account: AccountEntity): Promise<AccountEntity> {
    const existingAccount = await this.accountRepository.getBaseRepository().findOne({ 'email': account.email });
    if (existingAccount) {
      throw new FunctionalException('already_exist', `A user with the same email already exist :  ${account.email}`);
    }

    account.password = bcrypt.hashSync(account.password, 10);
    account.createdOn = new Date();
    return await super.create(account);
  }

  public async userInfo(token: string): Promise<AccountEntity> {
    let userAccount: AccountEntity;
    jwt.decode(Config.get().AUTH_JWT_KEY, token, (err, account: AccountEntity) => {
      if (err) {
        throw new InternalServerErrorException(err);
      }
      userAccount = account;
    });
    return userAccount;
  }
}
