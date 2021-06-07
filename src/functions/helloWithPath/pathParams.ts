import { HelloSchema } from '../../api/domain/types/schemas/helloSchema';

export default {
  type: 'object',
  properties: {
    helloId: HelloSchema.helloId,
  },
  required: ['helloId'],
} as const;
