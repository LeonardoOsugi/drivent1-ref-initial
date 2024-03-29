import { prisma } from '@/config';

async function findBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function findRoomId(roomId: number) {
  return prisma.room.findFirst({
    where: { id: roomId },
  });
}

async function createBooking(roomId: number, userId: number) {
  const booking = await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });

  return booking.id;
}

async function updateBooking(roomId: number, userId: number, bookingId: number) {
  const booking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
      userId,
    },
  });

  return booking.id;
}

async function countRooms(roomId: number) {
  return await prisma.booking.count({
    where: { roomId },
  });
}

const BookingRepository = {
  findBooking,
  findRoomId,
  createBooking,
  countRooms,
  updateBooking,
};

export default BookingRepository;
