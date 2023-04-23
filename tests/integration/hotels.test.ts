import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import { Hotel, TicketStatus } from '.prisma/client';
import {
  createEnrollmentWithAddress,
  createHotel,
  createHotelTicketType,
  createPayment,
  createRoom,
  createTicket,
  createUser,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';

import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with 404 when there is no enrollment', async () => {
      const token = await generateValidToken();
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with 404 when there is not ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const response = await server.get('/hotels/').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with 404 when no hotel was found', async () => {
      const token = await generateValidToken();
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    it('should respond with 402 when ticket is not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: faker.datatype.boolean(),
          includesHotel: faker.datatype.boolean(),
        },
      });
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with 402 when ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: true,
          includesHotel: faker.datatype.boolean(),
        },
      });
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with 402 when ticket doesn't includes hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: faker.datatype.boolean(),
          includesHotel: false,
        },
      });
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });
    it('should respond with 200 and return hotels', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);

      const ticketType = await prisma.ticketType.create({
        data: {
          name: faker.name.findName(),
          price: faker.datatype.number(),
          isRemote: false,
          includesHotel: true,
        },
      });
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotels = await prisma.hotel.create({
        data: {
          name: faker.datatype.string(),
          image: faker.image.abstract(),
        },
      });
      await createPayment(ticket.id, ticketType.price);

      const result = await server.get('/hotels').set({
        Authorization: `Bearer ${token}`,
      });
      expect(result.status).toBe(httpStatus.OK);

      expect(result.body).toEqual([
        {
          id: hotels.id,
          name: hotels.name,
          image: hotels.image,
          createdAt: hotels.createdAt.toISOString(),
          updatedAt: hotels.updatedAt.toISOString(),
        },
      ]);
    });
  });
});

// describe('GET /hotels/:hotelId', () => {
//   it('should respond with status 401 if no token is given', async () => {
//     const response = await server.get('/hotels/1');

//     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//   });

//   it('should respond with status 401 if given token is not valid', async () => {
//     const token = faker.lorem.word();

//     const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//   });

//   it('should respond with status 401 if there is no session for given token', async () => {
//     const userWithoutSession = await createUser();
//     const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

//     const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

//     expect(response.status).toBe(httpStatus.UNAUTHORIZED);
//   });

//   describe('when token is valid', () => {
//     it('should respond with 200 and return hotels with rooms', async () => {
//       const user = await createUser();
//       const token = await generateValidToken(user);
//       const enrollment = await createEnrollmentWithAddress(user);

//       const ticketType = await prisma.ticketType.create({
//         data: {
//           name: faker.name.findName(),
//           price: faker.datatype.number(),
//           isRemote: false,
//           includesHotel: true,
//         },
//       });
//       const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
//       await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
//       const hotels = await prisma.hotel.create({
//         data: {
//           name: faker.datatype.string(),
//           image: faker.image.abstract(),
//         },
//       });
//       const id = hotels.id;
//       const rooms = await prisma.room.create({
//         data: {
//           name: '4204',
//           capacity: 4,
//           hotelId: id,
//         },
//       });
//       await createPayment(ticket.id, ticketType.price);
//       const result = await server.get(`/hotels/${hotels.id}`).set({
//         Authorization: `Bearer ${token}`,
//       });

//       expect(result.status).toBe(httpStatus.OK);

//       expect(result.body).toEqual({
//         id: hotels.id,
//         name: hotels.name,
//         image: hotels.image,
//         createdAt: hotels.createdAt.toISOString(),
//         updatedAt: hotels.updatedAt.toISOString(),
//         Rooms: [
//           {
//             id: rooms.id,
//             name: rooms.name,
//             capacity: rooms.capacity,
//             hotelId: hotels.id,
//             createdAt: rooms.createdAt.toISOString(),
//             updatedAt: rooms.updatedAt.toISOString(),
//           },
//         ],
//       });
//     });

//     it('should respond with 404 when there is no enrollment', async () => {
//       const token = await generateValidToken();
//       const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

//       expect(response.status).toBe(httpStatus.NOT_FOUND);
//     });

//     it('should respond with 404 when there is not ticket', async () => {
//       const user = await createUser();
//       await createEnrollmentWithAddress(user);
//       const token = await generateValidToken(user);

//       const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

//       expect(response.status).toBe(httpStatus.NOT_FOUND);
//     });

//     it('should respond with 404 when no hotel was found', async () => {
//       const token = await generateValidToken();
//       const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

//       expect(response.status).toBe(httpStatus.NOT_FOUND);
//     });

//     it('should respond with 402 when ticket is not paid', async () => {
//       const user = await createUser();
//       const token = await generateValidToken(user);
//       const enrollment = await createEnrollmentWithAddress(user);
//       const ticketType = await prisma.ticketType.create({
//         data: {
//           name: faker.name.findName(),
//           price: faker.datatype.number(),
//           isRemote: faker.datatype.boolean(),
//           includesHotel: faker.datatype.boolean(),
//         },
//       });
//       const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
//       await createPayment(ticket.id, ticketType.price);

//       const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

//       expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
//     });

//     it('should respond with 402 when ticket is remote', async () => {
//       const user = await createUser();
//       const token = await generateValidToken(user);
//       const enrollment = await createEnrollmentWithAddress(user);
//       const ticketType = await prisma.ticketType.create({
//         data: {
//           name: faker.name.findName(),
//           price: faker.datatype.number(),
//           isRemote: true,
//           includesHotel: faker.datatype.boolean(),
//         },
//       });
//       const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
//       await createPayment(ticket.id, ticketType.price);

//       const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

//       expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
//     });

//     it("should respond with 402 when ticket doesn't includes hotel", async () => {
//       const user = await createUser();
//       const token = await generateValidToken(user);
//       const enrollment = await createEnrollmentWithAddress(user);
//       const ticketType = await prisma.ticketType.create({
//         data: {
//           name: faker.name.findName(),
//           price: faker.datatype.number(),
//           isRemote: faker.datatype.boolean(),
//           includesHotel: false,
//         },
//       });
//       const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
//       await createPayment(ticket.id, ticketType.price);

//       const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

//       expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
//     });
//   });
// });
