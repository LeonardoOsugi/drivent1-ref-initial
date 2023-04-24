import { Hotel, Room } from '@prisma/client';
import { notFoundError, paymentUnprocessable } from '@/errors';

import hotelsRepository from '@/repositories/hotels-repository';

async function hotelsGet(userId: number): Promise<Hotel[]> {
  const variables = await hotelsRepository.findByVariables(userId);
  const hotelsExist = await hotelsRepository.hotelsExist();

  if (!variables) throw notFoundError();
  if (
    variables.status === 'RESERVED' ||
    variables.TicketType.includesHotel === false ||
    variables.TicketType.isRemote === true
  )
    throw paymentUnprocessable();

  if (!hotelsExist || hotelsExist.length === 0) throw notFoundError();

  return hotelsExist;
}

async function hotelsGetId(
  hotelId: number,
  userId: number,
): Promise<
  Hotel & {
    Rooms: Room[];
  }
> {
  const variables = await hotelsRepository.findByVariables(userId);
  const hotelsExist = await hotelsRepository.hotelsRoomsExist(hotelId);

  if (!variables) throw notFoundError();

  if (
    variables.status === 'RESERVED' ||
    variables.TicketType.includesHotel === false ||
    variables.TicketType.isRemote === true
  )
    throw paymentUnprocessable();

  if (!hotelsExist) throw notFoundError();

  return hotelsExist;
}

export default {
  hotelsGet,
  hotelsGetId,
};
