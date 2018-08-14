import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '../test-server';

import { default as adminAccount } from '../resources/account/admin';
import { Config } from '../../src/config/config';

describe('(e2e) AuthController ', () => {

  let _token = null;

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

  it('/POST /auth/authenticate', async () => {
    const res = await request(TestServer.getHttpServer())
    .post('/auth/authenticate').send({ email : Config.get().ADMIN_ACCOUNT, password: Config.get().ADMIN_PWD});
    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.text).toBeDefined();
    _token = res.text;
  });

  it('/POST /auth/account', async () => {
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
  });
});
