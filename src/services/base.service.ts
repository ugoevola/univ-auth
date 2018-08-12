import { Repository, ObjectID } from 'typeorm';
import { TechnicalException } from '../common/exception/technical.exception';

export abstract class BaseService<E> {

  constructor(private repository: Repository<any>) { }

  async create(entity: any): Promise<any> {
    try {
      entity.createdOn = new Date();
      const insertResult = await this.repository.insert(entity);
      entity._id = insertResult.raw.insertedId;
      return entity;
    } catch (err) {
      throw new TechnicalException('mongo-error', err.message);
    }
  }

  async update(reference: string, entity: any): Promise<E> {
    entity.updatedOn = new Date();
    entity.reference = reference;
    try {
      await this.repository.update(this.condition('reference', reference), entity);
    } catch (err) {
      throw new TechnicalException('mongo-error', err.message);
    }
    return entity;
  }

  async updateWhere(entity: any, where: any): Promise<E> {
    entity.updatedOn = new Date();
    try {
      await this.repository.update(where, entity);
    } catch (err) {
      throw new TechnicalException('mongo-error', err.message);
    }
    return entity;
  }

  async delete(reference: string): Promise<boolean> {
    const result = await this.repository.delete(this.condition('reference', reference));
    return !!result;
  }

  findById(_id: ObjectID) {
    return this.repository.findOne({ where: { _id } });
  }

  findByReference(reference: string) {
    return this.repository.findOne({ where: { reference } });
  }

  private condition(name, value) {
    const literal = {};
    literal[name] = value;
    return literal;
  }
}
