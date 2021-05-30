export default {
  type: 'object',
  properties: {
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
  },
  required: ['email'],
} as const;
