import ExtensibleCustomError from 'extensible-custom-error';

export class CreateNewUserError extends ExtensibleCustomError {}

export const CreateNewUserErrorMessage = {
  emailAlreadyRegisteredError: 'emailAlreadyRegisteredError',
} as const;

export type CreateNewUserErrorMessage =
  typeof CreateNewUserErrorMessage[keyof typeof CreateNewUserErrorMessage];
