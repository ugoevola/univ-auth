import { Client, SearchResponse, CountResponse } from 'elasticsearch';
import { EsMappingService } from 'es-mapping-ts';
import { Injectable } from '@nestjs/common';
import { WinLogger } from '../../common/logger/winlogger';
import { EsModel } from '../schema/base.schema';
import { RepositoryManager } from '../repository.manager';
import { TechnicalException } from '../../common/exception/technical.exception';
import * as lodash from 'lodash';
import { FunctionalException } from '../../common/exception/functional.exception';

export interface IRead<E> {
  findById(id: string): Promise<E>;
  findById(id: string): Promise<E>;
  findOne(query: any): Promise<E>;
  findOneMatch(query: any): Promise<E>;
  find(query: any): Promise<E[]>;
  findMatch(match: any): Promise<E[]>;
  exists(id: string): Promise<boolean>;
  search(cond: EsSearchCond): Promise<SearchResponse<E>>;
  qsearch(cond: string): Promise<SearchResponse<E>>;
  count(cond?: EsSearchCond): Promise<CountResponse>;
}

export interface IWrite<E> {
  create(item: E): Promise<E>;
  update(item: E): Promise<E>;
  delete(item: E): Promise<boolean>;
}

export interface EsSearchCond {
  query?: {
    match?: any
  };
  facets?: {
    tags?: any;
  };
}

@Injectable()
export abstract class RepositoryBase<E extends EsModel> implements IRead<E>, IWrite<E> {

  private logger: WinLogger = WinLogger.get('es-access');

  private client: Client;

  private index: string;

  private type: string;

  constructor() {
    this.client = RepositoryManager.client();
    this.type = this.getType();
    const esMapping = lodash.find(EsMappingService.getInstance().getMappings(), (mapping) => {
      return mapping.type === this.type;
    });
    this.index = esMapping.index;
  }

  /**
   * Index a new document
   * @param document
   */
  async create(document: E, refresh = true): Promise<E> {
    try {
      const createResult = await this.client.index({
        index: this.index,
        type: this.type,
        id: this.getDocumentId(document),
        refresh: refresh,
        body: document
      });
      return this.findById(createResult._id);
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  /**
  * update a document
  * @param document
  */
  async update(document: E, refresh = true): Promise<E> {
    const internalId = this.getDocumentId(document);
    delete document._id;
    try {
      const updateResult = await this.client.update({
        index: this.index,
        type: this.type,
        id: internalId,
        refresh: refresh,
        body: {
          doc: document
        }
      });
      this.logger.debug(`Mise à jour de ${this.type}, ${updateResult._id}, json : ${JSON.stringify(document)}`);
      return this.findById(updateResult._id);
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }

  /**
   * delete a document
   * @param document
   */
  async delete(document: E, refresh = true): Promise<boolean> {
    try {
      const deleteResult = await this.client.delete({
        index: this.index,
        type: this.type,
        refresh: refresh,
        id: this.getDocumentId(document)
      });
      return deleteResult.found;
    } catch (err) {
      throw new TechnicalException('es-exception', 'An error occured while trying to delete document', err);
    }
  }

  /**
   * find a document by id
   * @param document
   */
  async findById(idValue: string): Promise<E> {
    this.logger.debug(`Find ${this.type}  by Id ${idValue}`);
    try {
      const results = await this.client.search({
        index: this.index,
        type: this.type,
        body: {
          query: {
            match: {
              _id: idValue
            }
          }
        }
      });
      if (results.hits.total > 0) {
        return this.toModelObject(results.hits.hits)[0];
      } else {
        return null;
      }
    } catch (error) {
      throw new TechnicalException('es-exception', 'An error occured while trying to search document by id', error);
    }
  }

  /**
   * find a document by id
   * @param document
   */
  async findMatch(match: any): Promise<E[]> {
    const internalQuery: any = this.buildMatchQuery(match);
    try {
      const results = await this.client.search({
        index: this.index,
        type: this.type,
        body: {
          query: internalQuery
        }
      });
      if (results.hits.total > 0) {
        return this.toModelObject(results.hits.hits);
      } else {
        return null;
      }
    } catch (error) {
      throw new TechnicalException('es-exception', 'An error occured while trying to search document', error);
    }
  }

  /**
   * find documents by query
   * @param document
   */
  async find(query: any): Promise<E[]> {
    try {
      const results = await this.client.search({
        index: this.index,
        type: this.type,
        body: {
          query: query
        }
      });
      if (results.hits.total > 0) {
        return this.toModelObject(results.hits.hits);
      } else {
        return null;
      }
    } catch (error) {
      throw new TechnicalException('es-exception', 'An error occured while trying to search document', error);
    }
  }

  /**
   * find a document by id
   * @param document
   */
  async findOne(query: any): Promise<E> {
    try {
      const results = await this.client.search({
        index: this.index,
        type: this.type,
        size: 1,
        body: {
          query: query
        }
      });
      if (results.hits.total > 0) {
        return this.toModelObject(results.hits.hits)[0];
      } else {
        return null;
      }
    } catch (error) {
      throw new TechnicalException('es-exception', 'An error occured while trying to search document', error);
    }
  }

  async findOneFiltered(filter: any): Promise<E> {
    try {
      const results = await this.client.search({
        index: this.index,
        type: this.type,
        size: 1,
        body: {
          query: {
            bool: {
              must: {
                term: filter
              }
            }
          }
        }
      });
      if (results.hits.total > 0) {
        return this.toModelObject(results.hits.hits)[0];
      } else {
        return null;
      }
    } catch (err) {
      throw new FunctionalException('es-exception', 'An error occured while trying to search document', err);
    }
  }

  /**
 * find a document by id
 * @param document
 */
  async findOneMatch(match: any): Promise<E> {
    const internalQuery: any = this.buildMatchQuery(match);
    try {
      const results = await this.client.search({
        index: this.index,
        type: this.type,
        size: 1,
        body: {
          query: internalQuery
        }
      });
      if (results.hits.total > 0) {
        return this.toModelObject(results.hits.hits)[0];
      } else {
        return null;
      }
    } catch (error) {
      throw new TechnicalException('es-exception', 'An error occured while trying to search document', error);
    }
  }

  /**
   * check if the document exists by id
   * @param id
   */
  async exists(id: string): Promise<boolean> {
    const exist = await this.client.exists({
      index: this.index,
      type: this.type,
      id: id,
    });
    return exist;
  }

  /**
   * Search a document by condition
   * @param cond
   */
  async search(cond: EsSearchCond): Promise<SearchResponse<E>> {
    const results = await this.client.search({
      index: this.index,
      body: cond,
    });
    return results;
  }

  /**
   * Search a document by query string condition
   * @param cond
   */
  async qsearch(cond: string): Promise<SearchResponse<E>> {
    const results = this.client.search({
      index: this.index,
      q: cond,
    });
    return results;
  }

  /**
   * Count the number of document
   * @param cond
   */
  count(cond?: EsSearchCond): Promise<CountResponse> {
    const count: any = {
      index: this.index,
    };
    if (cond) {
      count.body = cond;
    }
    return this.client.count(count);
  }

  /**
   * Permet de transformer en objet source
   * @param hit
   */
  public toModelObject(hits: any): E[] {
    let source: any[] = new Array();
    if (hits instanceof Array) {
      source = hits;
    } else {
      source = [hits];
    }
    const retour: E[] = new Array<E>();
    source.forEach(element => {
      const object: E = <E>element._source;
      object._id = element._id;
      retour.push(Object.assign(this.newObject(), object));
    });
    return retour;
  }

  private buildMatchQuery(match: any): any {
    const internalQuery: any = {
      bool: {
        must: []
      }
    };

    Object.getOwnPropertyNames(match).forEach(p => {
      const uniqueMatch: any = {
        match: {
        }
      };
      uniqueMatch.match[p] = match[p];
      internalQuery.bool.must.push(uniqueMatch);
    });
    return internalQuery;
  }

  abstract getType(): string;
  abstract getDocumentId(document: E): any;
  abstract newObject(): E;
}
