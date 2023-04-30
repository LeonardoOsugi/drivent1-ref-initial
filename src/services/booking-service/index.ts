import { forbidenError, notFoundError } from '@/errors';
import BookingRepository from '@/repositories/booking-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelRepository from '@/repositories/hotel-repository';
import ticketsRepository from '@/repositories/tickets-repository';

//retorna um booking por userId
async function getBooking(userId: number) {
  const booking = await BookingRepository.findBooking(userId);

  if (!booking) throw notFoundError();

  return booking;
}

//Verifica se enrollment e ticket existem
async function hotelsList(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbidenError();
  }
}

//busca um hotel por userId
async function hotelsGet(userId: number) {
  await hotelsList(userId);

  const hotels = await hotelRepository.findHotels();
  if (!hotels || hotels.length === 0) {
    throw notFoundError();
  }
  return hotels;
}

//Procura um Quarto pelo Id
async function findRoomId(roomId: number) {
  const room = await BookingRepository.findRoomId(roomId);

  if (!room) throw notFoundError();

  const roomsCount = await BookingRepository.countRooms(roomId);

  if (roomsCount >= room.capacity) throw forbidenError();

  return room;
}

//Cria um booking
async function postBooking(userId: number, roomId: number) {
  await hotelsGet(userId);

  await findRoomId(roomId);

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

  return await BookingRepository.createBooking(roomId, userId, bookingId);
}

export default { getBooking, postBooking, putBooking };
