import ExtensibleCustomError from 'extensible-custom-error';

export class FetchAddressByPostalCodeError extends ExtensibleCustomError {}

export const FetchAddressByPostalCodeErrorMessage = {
  addressDoseNotFoundError: 'addressDoseNotFoundError',
  unexpectedError: 'unexpectedError',
} as const;

export type FetchAddressByPostalCodeErrorMessage =
  typeof FetchAddressByPostalCodeErrorMessage[keyof typeof FetchAddressByPostalCodeErrorMessage];
