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

  const booking = await BookingRepository.createBooking(roomId, userId);

  return booking;
}

async function putBooking(userId: number, bookingId: number, roomId: number) {
  const bookingReserved = await getBooking(userId);

  if (!bookingReserved) throw forbidenError();

  const getOut = bookingReserved.Room.capacity + 1;

  await BookingRepository.UpdateRoom(bookingReserved.Room.id, getOut);

  const room = await findRoomId(roomId);

  await BookingRepository.UpdateRoom(roomId, room.capacity - 1);

  return BookingRepository.createBooking(roomId, userId, bookingId);
}

export default { getBooking, postBooking, putBooking };
