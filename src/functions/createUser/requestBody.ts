import { UserSchema } from '../../api/domain/types/schemas/userSchema';

export default {
  type: 'object',
  properties: {
    email: UserSchema.email,
    phoneNumber: UserSchema.phoneNumber,
  },
  required: ['email'],
} as const;
