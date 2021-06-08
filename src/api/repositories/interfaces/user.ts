import { UserEntity } from '../../domain/types/userEntity';
import { CreateNewUserError } from '../errors/createNewUserError';

export type CreateNewUserParams = {
  email: string;
  phoneNumber?: string;
};

export type CreateNewUserResponse = {
  isSuccessful: boolean;
  userEntity?: UserEntity;
  error?: CreateNewUserError;
};

export type CreateNewUser<T> = (
  datastoreClient: T,
  params: CreateNewUserParams,
) => Promise<CreateNewUserResponse>;
