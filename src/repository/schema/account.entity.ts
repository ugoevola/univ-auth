import { Role } from './role.enum';
import { Entity, ObjectIdColumn, PrimaryColumn, ObjectID, Column } from 'typeorm';
import { IMongoModel } from './mongo-base.schema';

export interface IAccount extends IMongoModel {
  email: string;
  password: string;
  role: Role;
  name: string;
  givenName: string;
  lastLoginAttempt: Date;
  lastLoginSuccessful: Date;
}

@Entity()
export class AccountEntity implements IAccount {

  @ObjectIdColumn()
  _id?: ObjectID;

  @PrimaryColumn()
  email: string;

  @Column()
  password: string;

  @Column()
  role: Role;

  @Column()
  name: string;

  @Column()
  givenName: string;

  @Column()
  lastLoginAttempt: Date;

  @Column()
  lastLoginSuccessful: Date;
}


