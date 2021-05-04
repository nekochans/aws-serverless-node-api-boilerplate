export default {
  type: 'object',
  properties: {
    postalCode: {
      type: 'string',
      minLength: 7,
      maxLength: 7,
    },
  },
  required: ['postalCode'],
} as const;
