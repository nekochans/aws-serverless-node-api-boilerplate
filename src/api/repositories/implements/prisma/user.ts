import { PrismaClient, users } from '@prisma/client';
import {
  CreateNewUser,
  CreateNewUserParams,
  CreateNewUserResponse,
} from '../../interfaces/user';
import {
  CreateNewUserError,
  CreateNewUserErrorMessage,
} from '../../errors/createNewUserError';

export const createNewUser: CreateNewUser<PrismaClient> = async (
  datastoreClient,
  { email, phoneNumber },
): Promise<CreateNewUserResponse> => {
  const user = await datastoreClient.users_emails.findFirst({
    where: {
      email: email,
    },
  });

  if (user) {
    return {
      isSuccessful: false,
      error: new CreateNewUserError(
        CreateNewUserErrorMessage.emailAlreadyRegisteredError,
      ),
    };
  }

  const newUser = await datastoreClient.users.create(
    createUserParams({ email, phoneNumber }),
  );

  const userEntity = await createUserEntity(datastoreClient, newUser);

  return {
    isSuccessful: true,
    userEntity: userEntity,
  };
};

const createUserParams = (createNewUserParams: CreateNewUserParams) => {
  const params = {
    data: {
      users_emails: {
        create: { email: createNewUserParams.email },
      },
    },
  };

  if (createNewUserParams.phoneNumber !== undefined) {
    params.data['users_phone_numbers'] = {
      create: [{ phone_number: createNewUserParams.phoneNumber }],
    };
  }

  return params;
};

const createUserEntity = async (prisma: PrismaClient, newUser: users) => {
  const responseData = await prisma.users.findUnique({
    where: {
      id: newUser.id,
    },
    include: {
      users_emails: true,
      users_phone_numbers: true,
    },
  });

  const userEntity = {
    id: responseData.id,
    email: {
      id: responseData.users_emails.id,
      email: responseData.users_emails.email,
    },
  };

  if (responseData.users_phone_numbers.length !== 0) {
    userEntity['phoneNumbers'] = responseData.users_phone_numbers.map(
      (value) => {
        return { id: value.id, phoneNumber: value.phone_number };
      },
    );
  }

  return userEntity;
};
