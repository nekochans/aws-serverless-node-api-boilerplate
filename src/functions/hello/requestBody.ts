import { HelloSchema } from '../../api/domain/types/schemas/helloSchema';

export default {
  type: 'object',
  properties: {
    name: HelloSchema.name,
    status: HelloSchema.status,
  },
  required: ['name', 'status'],
} as const;
