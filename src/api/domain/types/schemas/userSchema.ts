export const UserSchema = {
  email: {
    type: 'string',
    format: 'email',
    maxLength: 254,
  },
  phoneNumber: {
    type: 'string',
    minLength: 10,
    maxLength: 11,
  },
} as const;

export type UserSchema = typeof UserSchema[keyof typeof UserSchema];
