import mongoose from 'mongoose';
import { UserCollectionHelper } from '../testUtils.js';
import supertest from 'supertest';
import app from '../../application/web';

describe('/auth', function () {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
    await UserCollectionHelper.addUser({});
  });

  afterAll(async () => {
    await UserCollectionHelper.deleteUser();
    await mongoose.connection.close();
  });

  describe('POST /api/auth', function () {
    it('should response 400 if username is not correct', async () => {
      const response = await supertest(app).post('/api/auth').send({
        username: 'salah',
        password: 'test12345',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid Username');
    });

    it('should response 400 if password is not correct', async () => {
      const response = await supertest(app).post('/api/auth').send({
        username: 'test12345',
        password: 'salah',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid Password');
    });

    it('should response 200 and return new access token', async () => {
      const response = await supertest(app).post('/api/auth').send({
        username: 'test12345',
        password: 'test12345',
      });

      expect(response.status).toBe(201);
      expect(response.body.data.accessToken).toBeDefined();
    });
  });

  describe('GET /api/auth/refresh', function () {
    it('should response 401 if the cookie is undefined', async () => {
      const response = await supertest(app).get('/api/auth/refresh').send();

      expect(response.status).toBe(401);
    });

    it('should response 401 if the cookie is invalid', async () => {
      const response = await supertest(app)
        .get('/api/auth/refresh')
        .set('Cookie', ['jwt=invalid'])
        .send();

      expect(response.status).toBe(403);
    });

    it('should response 200 and return accessToken if the cookie is valid', async () => {
      const refreshToken = await UserCollectionHelper.getRefreshToken();
      const response = await supertest(app)
        .get('/api/auth/refresh')
        .set('Cookie', [`jwt=${refreshToken}`])
        .send();

      console.log(response);

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
    });
  });
});
