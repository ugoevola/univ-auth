import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '../test-server';
import * as lodash from 'lodash';
import { default as adminAccount } from '../resources/account/admin';
import { Config } from '../../src/config/config';

describe('(e2e) AuthController ', () => {

  let _token = null;
  let newAdminAccount = null;

  beforeAll(async () => {
    TestServer.getLogger().info('Starting test');
    try {
      await TestServer.bootstrap();
    } catch (err) {
      TestServer.getLogger().error('Starting test fail', err);
      throw new Error('Starting test fail');
    }
  });

  afterAll(async () => {
    await TestServer.getApplication().close();
  });

  it('/POST /auth/authenticate : should authenticate admin', async () => {
    const res = await request(TestServer.getHttpServer())
    .post('/auth/authenticate').send({ email : Config.get().ADMIN_ACCOUNT, password: Config.get().ADMIN_PWD});
    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.text).toBeDefined();
    _token = res.text;
  });


  it('/POST /auth/account : should create a new account', async () => {
    const res = await request(TestServer.getHttpServer())
      .post('/auth/account')
      .set('authorization', _token).send(adminAccount);

    expect(res.status).toEqual(HttpStatus.CREATED);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toEqual(adminAccount.name);
    expect(res.body.email).toEqual(adminAccount.email);
    expect(res.body.role).toEqual(adminAccount.role);
    expect(res.body.password).not.toBeDefined();
    expect(res.body.createdOn).toBeDefined();

    newAdminAccount = res.body;
  });

  it('/POST /auth/account : should not create an account with missing properties', async () => {
    const newAccount = lodash.cloneDeep(newAdminAccount);
    delete newAccount._id;
    delete newAccount.password;
    delete newAccount.email;

    const res = await request(TestServer.getHttpServer())
      .post('/auth/account')
      .set('authorization', _token).send(newAccount);

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
  });

  it('/POST /auth/account : should not create an account with the same email', async () => {
    const newAccount = lodash.cloneDeep(newAdminAccount);
    delete newAccount._id;
    newAccount.password = 'admin';

    const res = await request(TestServer.getHttpServer())
      .post('/auth/account')
      .set('authorization', _token).send(newAccount);

    expect(res.status).toEqual(HttpStatus.CONFLICT);
    expect(res.body.code).toEqual('already_exist');
  });

  it('/POST /auth/authenticate : should authenticate with new account', async () => {
    const res = await request(TestServer.getHttpServer())
    .post('/auth/authenticate').send({ email : adminAccount.email, password: adminAccount.password});
    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.text).toBeDefined();
    _token = res.text;
  });

});
