import { AddressSchema } from '../../api/domain/types/schemas/addressSchema';

export default {
  type: 'object',
  properties: {
    postalCode: AddressSchema.postalCode,
  },
  required: ['postalCode'],
} as const;
