import { Role } from './role.enum';
import { EsEntity, EsField } from 'es-mapping-ts';
import { EsModel, IEsModel } from './base.schema';

export interface IAccount extends IEsModel {
  email: string;
  password: string;
  role: Role;
  name: string;
  givenName: string;
  lastLoginAttempt: Date;
  lastLoginSuccessful: Date;
}

@EsEntity({
  index: 'accounts',
  type: 'account'
})
export class Account extends EsModel implements IAccount {

  @EsField({
    type: 'keyword'
  })
  email: string;

  @EsField({
    type: 'text',
    analyzer: 'whitespace'
  })
  password: string;

  @EsField({
    type: 'keyword'
  })
  role: Role;

  @EsField({
    type: 'text',
    analyzer: 'whitespace'
  })
  name: string;

  @EsField({
    type: 'text',
    analyzer: 'whitespace'
  })
  givenName: string;

  @EsField({
    type: 'date'
  })
  lastLoginAttempt: Date;

  @EsField({
    type: 'date'
  })
  lastLoginSuccessful: Date;
}


