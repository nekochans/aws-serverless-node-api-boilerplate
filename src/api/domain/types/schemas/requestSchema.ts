export const RequestSchema = {
  'x-request-id': {
    type: 'string',
    minLength: 36,
    maxLength: 36,
  },
} as const;

export type RequestSchema = typeof RequestSchema[keyof typeof RequestSchema];
