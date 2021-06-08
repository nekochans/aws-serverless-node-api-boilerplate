import { PrismaClient, users } from '@prisma/client';
import { UserEntity } from '../../../../domain/types/userEntity';
import { CreateNewUser, CreateNewUserParams } from '../../../interfaces/user';

export const createNewUser: CreateNewUser<PrismaClient> = async (
  datastoreClient,
  { email, phoneNumber },
): Promise<UserEntity> => {
  const newUser = await datastoreClient.users.create(
    createUserParams({ email, phoneNumber }),
  );

  return await createUserEntity(datastoreClient, newUser);
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
