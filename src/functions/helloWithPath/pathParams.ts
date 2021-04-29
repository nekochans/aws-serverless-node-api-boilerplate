export default {
  type: 'object',
  properties: {
    helloId: { type: 'string' },
  },
  required: ['helloId'],
} as const;
