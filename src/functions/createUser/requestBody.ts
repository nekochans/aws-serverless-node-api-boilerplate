export default {
  type: 'object',
  properties: {
    email: {
      type: 'email',
    },
  },
  required: ['email'],
} as const;
