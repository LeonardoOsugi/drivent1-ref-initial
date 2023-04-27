import { ApplicationError } from '@/protocols';

export function forbidenError(): ApplicationError {
  return {
    name: 'ForbidenError',
    message: 'no vacancy or outside the business rule',
  };
}
