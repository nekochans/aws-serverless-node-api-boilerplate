export default {
  type: 'object',
  properties: {
    'content-type': { type: 'string' },
  },
  required: ['content-type'],
} as const;
