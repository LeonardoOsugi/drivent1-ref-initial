import supertest from 'supertest';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import faker from '@faker-js/faker';
import { Hotel, TicketStatus } from '@prisma/client';
import {
  createEnrollmentWithAddress,
  createHotel,
  createHotelTicketType,
  createRoom,
  createTicket,
  createUser,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels/', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 if there are no enrollments, ticket or hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with status 402 if ticket has not been paid for, is remote or does not include hotel', async () => {
      const name = 'evento';
      const price = 1234;
      const isRemote = true;
      const includesHotel = false;
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createHotelTicketType(name, price, isRemote, includesHotel);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const response = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    it(`should respond with status 200 and hotel array with hotel`, async () => {
      const name = 'evento';
      const price = 1234;
      const isRemote = false;
      const includesHotel = true;
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createHotelTicketType(name, price, isRemote, includesHotel);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      const hotels = response.body as Hotel[];

      expect(response.status).toBe(httpStatus.OK);
      expect(hotels).toEqual([
        {
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          createdAt: hotel.createdAt.toISOString(),
          updatedAt: hotel.updatedAt.toISOString(),
        },
      ]);
    });
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe('when token is valid', () => {
    it('should respond with status 404 if there are no enrollments, ticket or hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get(`/hotels/1`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    //     it('should respond with status 422 if ticket has not been paid for, is remote or does not include hotel', async () => {
    //       const name = 'evento';
    //       const price = 1234;
    //       const isRemote = true;
    //       const includesHotel = false;
    //       const user = await createUser();
    //       const token = await generateValidToken(user);
    //       const enrollment = await createEnrollmentWithAddress(user);
    //       const ticketType = await createHotelTicketType(name, price, isRemote, includesHotel);
    //       await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    //       const response = await server.get(`/hotels/1`).set('Authorization', `Bearer ${token}`);

    //       expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    //     });
    //     it(`should respond with status 200 and hotel array with hotel`, async () => {
    //       const name = 'evento';
    //       const price = 1234;
    //       const isRemote = false;
    //       const includesHotel = true;
    //       const user = await createUser();
    //       const token = await generateValidToken(user);
    //       const enrollment = await createEnrollmentWithAddress(user);
    //       const ticketType = await createHotelTicketType(name, price, isRemote, includesHotel);
    //       await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    //       const hotel = await createHotel();
    //       const room = await createRoom(hotel.id);

    //       const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

    //       const hotels = response.body as Hotel[];

    //       expect(response.status).toBe(httpStatus.OK);
    //       expect(hotels).toEqual([
    //         {
    //           id: hotel.id,
    //           name: hotel.name,
    //           image: hotel.image,
    //           Rooms: [
    //             {
    //               id: room.id,
    //               name: room.name,
    //               capacity: room.capacity,
    //               hotelId: room.hotelId,
    //               createdAt: room.createdAt.toISOString(),
    //               updatedAt: room.updatedAt.toISOString(),
    //             },
    //           ],
    //           createdAt: hotel.createdAt.toISOString(),
    //           updatedAt: hotel.updatedAt.toISOString(),
    //         },
    //       ]);
    //     });
  });
});
