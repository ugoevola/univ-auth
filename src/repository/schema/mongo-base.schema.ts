import { ObjectID, ObjectLiteral } from 'typeorm';

export interface IMongoModel extends ObjectLiteral {
  _id?: ObjectID;
  reference?: string;
  createdOn?: Date;
  updatedOn?: Date;
}
