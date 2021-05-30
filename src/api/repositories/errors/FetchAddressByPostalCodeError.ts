import ExtensibleCustomError from 'extensible-custom-error';

export class FetchAddressByPostalCodeError extends ExtensibleCustomError {}

export const FetchAddressByPostalCodeErrorMessage = {
  addressDoseNotFoundError: 'AddressDoseNotFoundError',
  unexpectedError: 'UnexpectedError',
} as const;

export type FetchAddressByPostalCodeErrorMessage =
  typeof FetchAddressByPostalCodeErrorMessage[keyof typeof FetchAddressByPostalCodeErrorMessage];
