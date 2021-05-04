import Ajv from 'ajv';
import {
  SuccessResponse,
  ErrorResponse,
  ValidationErrorResponse,
} from '../Response';

type Request = {
  postalCode: string;
};

type ResponseBody = {
  postalCode: string;
  region: string;
  locality: string;
};

type AddressSearchSuccessResponse = SuccessResponse<ResponseBody>;

type ErrorCode = 'NotFoundAddress' | 'NotAllowedPostalCode';

type ErrorMessage =
  | 'address is not found'
  | 'not allowed to search by that postalCode';

type AddressSearchErrorResponse = ErrorResponse<ErrorCode, ErrorMessage>;

const schema = {
  type: 'object',
  properties: {
    postalCode: {
      type: 'string',
      minLength: 7,
      maxLength: 7,
    },
  },
  required: ['postalCode'],
  additionalProperties: false,
};

const ajv = new Ajv({ allErrors: true });

const validate = ajv.compile(schema);

export const addressSearch = (
  request: Request,
):
  | AddressSearchSuccessResponse
  | AddressSearchErrorResponse
  | ValidationErrorResponse => {
  const valid = validate(request);

  if (!valid) {
    const validationErrors = validate.errors.map((value) => {
      return {
        key: value.instancePath.replace('/', ''),
        reason: value.message,
      };
    });

    return {
      statusCode: 422,
      body: {
        message: 'Unprocessable Entity',
        validationErrors,
      },
    };
  }

  if (request.postalCode === '1000000') {
    return {
      statusCode: 400,
      body: {
        code: 'NotAllowedPostalCode',
        message: 'not allowed to search by that postalCode',
      },
    };
  }

  return {
    statusCode: 200,
    body: {
      postalCode: '1620062',
      region: '東京',
      locality: '市谷加賀町',
    },
  };
};

export default addressSearch;
