import { ApplicationError } from '@/protocols';

export function paymentUnprocessable(): ApplicationError {
  return {
    name: 'PaymentUnprocessable',
    message: 'payment required',
  };
}
