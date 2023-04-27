import { notFoundError } from '@/errors';
import BookingRepository from '@/repositories/booking-repository';

async function getBooking(userId: number) {
  const booking = await BookingRepository.findBooking(userId);

  if (!booking) throw notFoundError();

  return booking;
}

export default { getBooking };
