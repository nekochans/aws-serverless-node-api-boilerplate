import { RequestSchema } from '../../api/domain/types/schemas/requestSchema';

export default {
  type: 'object',
  properties: {
    authorization: { type: 'string' },
    'content-type': { type: 'string' },
    'x-request-id': RequestSchema['x-request-id'],
  },
  required: ['authorization'],
} as const;
