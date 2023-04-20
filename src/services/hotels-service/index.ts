import { Hotel } from '@prisma/client';
import { notFoundError, paymentUnprocessable } from '@/errors';

import hotelsRepository from '@/repositories/hotels-repository';

async function hotelsGet(userId: number): Promise<Hotel[]> {
  const variables = await hotelsRepository.findByVariables(userId);
  const hotelsExist = await hotelsRepository.hotelsExist();

  if (!variables || !hotelsExist) throw notFoundError();

  if (
    variables.status === 'RESERVED' ||
    variables.TicketType.includesHotel === false ||
    variables.TicketType.isRemote === true
  )
    throw paymentUnprocessable();

  return hotelsExist;
}

export default {
  hotelsGet,
};