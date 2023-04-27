import hotelsService from '../hotels-service';
import { forbidenError, notFoundError } from '@/errors';
import BookingRepository from '@/repositories/booking-repository';

async function getBooking(userId: number) {
  const booking = await BookingRepository.findBooking(userId);

  if (!booking) throw notFoundError();

  return booking;
}

async function findRoomId(roomId: number) {
  const room = await BookingRepository.findRoomId(roomId);

  if (!room) throw notFoundError();

  if (room.capacity <= 0) throw forbidenError();

  return room;
}

async function postBooking(userId: number, roomId: number) {
  await hotelsService.getHotels(userId);

  const room = await findRoomId(roomId);

  const newCapacity = room.capacity - 1;

  await BookingRepository.UpdateRoom(roomId, newCapacity);

  const booking = await BookingRepository.createBooking(userId, roomId);

  return booking;
}

export default { getBooking, postBooking };
