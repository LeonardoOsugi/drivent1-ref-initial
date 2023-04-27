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

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

const BookingRepository = {
  findBooking,
  findRoomId,
  UpdateRoom,
  createBooking,
};

export default BookingRepository;
