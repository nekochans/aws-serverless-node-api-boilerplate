export const AddressSchema = {
  postalCode: {
    type: 'string',
    minLength: 7,
    maxLength: 7,
  },
} as const;

export type AddressSchema = typeof AddressSchema[keyof typeof AddressSchema];
