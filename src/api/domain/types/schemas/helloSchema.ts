export const HelloSchema = {
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
  helloId: {
    type: 'string',
    minLength: 4,
    maxLength: 8,
  },
} as const;

export type HelloSchema = typeof HelloSchema[keyof typeof HelloSchema];
