export default {
  type: 'object',
  properties: {
    'content-type': { type: 'string' },
    'x-request-id': { type: 'string' },
  },
  required: ['content-type'],
} as const;
