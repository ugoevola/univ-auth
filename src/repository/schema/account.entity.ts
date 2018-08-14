import { Role } from './role.enum';
import { Entity, ObjectIdColumn, PrimaryColumn, ObjectID, Column } from 'typeorm';
import { IMongoModel } from './mongo-base.schema';

@Entity()
export class AccountEntity implements IMongoModel {

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
  lastLoginAttempt: Date;

  @Column()
  lastLoginSuccessful: Date;

  @Column()
  createdOn: Date;

  @Column()
  updatedOn: Date;
}


