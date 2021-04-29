export default {
  type: 'object',
  properties: {
    authorization: { type: 'string' },
  },
  required: ['authorization'],
} as const;
