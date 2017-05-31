import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import faker from 'faker';
import app from '../src';


describe('requests', () => {
  let server;

  beforeAll(() => {
    jasmine.addMatchers(matchers); // eslint-disable-line no-undef
  });

  beforeEach(() => {
    server = app().listen();
  });

  it('GET 200', async () => {
    const res = await request.agent(server)
      .get('/');
    expect(res).toHaveHTTPStatus(200);
  });

  it('GET 404', async () => {
    const res = await request.agent(server)
      .get('/wrong-path');
    expect(res).toHaveHTTPStatus(302);
  });

  it('regisration', async () => {
    const res = await request.agent(server)
      .post('/users')
      .type('form')
      .send({ email: faker.internet.email(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        password: faker.internet.password() })
        .set('user-agent', faker.internet.userAgent)
        .set('content-type', 'application/x-www-form-urlencoded')
        .set('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8');
    expect(res).toHaveHTTPStatus(302);
  });

  it('restriction profile - avatar', async () => {
    const res = await request.agent(server)
      .get('/users/1/avatar');
    expect(res).toHaveHTTPStatus(302);
  });

  it('restriction profile - update profile', async () => {
    const res = await request.agent(server)
      .patch('/users/1/edit');
    expect(res).toHaveHTTPStatus(302);
  });

  it('restriction delete other users', async () => {
    const res = await request.agent(server)
      .delete('/users/1');
    expect(res).toHaveHTTPStatus(302);
  });

  it('restriction on the changes of other users', async () => {
    const res = await request.agent(server)
      .patch('/users/1');
    expect(res).toHaveHTTPStatus(302);
  });

  it('non-existent user', async () => {
    const res = await request.agent(server)
      .get('/users/wronguser');
    expect(res).toHaveHTTPStatus(200);
  });

  it('restriction on viewing tasks without registration', async () => {
    const res = await request.agent(server)
      .get('/tasks/');
    expect(res).toHaveHTTPStatus(302);
  });

  it('restriction on viewing task without registration', async () => {
    const res = await request.agent(server)
      .get('/tasks/1');
    expect(res).toHaveHTTPStatus(302);
  });

  it('restriction on viewing comments without registration', async () => {
    const res = await request.agent(server)
      .get('/comment/1');
    expect(res).toHaveHTTPStatus(302);
  });

  afterEach((done) => {
    server.close();
    done();
  });
});
