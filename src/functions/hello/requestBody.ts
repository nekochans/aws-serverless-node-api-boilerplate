export default {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 4,
      maxLength: 8,
    },
    status: {
      type: 'number',
      minimum: 1,
      maximum: 1,
    },
  },
  required: ['name', 'status'],
} as const;
