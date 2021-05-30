export type UserEntity = {
  userId: number;
  email: emailEntity;
  phoneNumbers?: phoneNumberEntity[];
};

export type emailEntity = {
  id: number;
  email: string;
};

type phoneNumberEntity = {
  id: number;
  phoneNumber: string;
};
