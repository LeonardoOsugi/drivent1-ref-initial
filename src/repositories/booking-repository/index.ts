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

async function UpdateRoom(roomId: number, newCapacity: number) {
  return prisma.room.update({
    where: { id: roomId },
    data: { capacity: newCapacity },
  });
}

async function createBooking(roomId: number, userId: number, bookingId?: number) {
  const booking = await prisma.booking.upsert({
    where: {
      id: bookingId,
    },
    update: {
      userId,
      roomId,
    },
    create: {
      userId,
      roomId,
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
  UpdateRoom,
  createBooking,
  countRooms,
};

export default BookingRepository;
