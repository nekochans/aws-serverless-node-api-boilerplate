import Ajv from 'ajv';
import {
  SuccessResponse,
  ErrorResponse,
  ValidationErrorResponse,
} from '../Response';
import { FetchAddressByPostalCode } from '../repositories/interfaces/address';
import {
  FetchAddressByPostalCodeError,
  FetchAddressByPostalCodeErrorMessage,
} from '../repositories/errors/FetchAddressByPostalCodeError';
import assertNever from '../utils/assertNever';
import { HttpStatusCode } from '@constants/HttpStatusCode';
import { valueOf } from '../utils/valueOf';

type Request = {
  postalCode: string;
};

type ResponseBody = {
  postalCode: string;
  region: string;
  locality: string;
};

export type AddressSearchSuccessResponse = SuccessResponse<ResponseBody>;

type Errors = {
  notFoundAddress: 'address is not found';
  notAllowedPostalCode: 'not allowed to search by that postalCode';
  unexpectedError: 'unexpected error';
};

type ErrorCode = keyof Errors;
type ErrorMessage = valueOf<Errors>;

export type AddressSearchErrorResponse = ErrorResponse<ErrorCode, ErrorMessage>;

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

export const addressSearch = async (
  request: Request,
  fetchAddressByPostalCode: FetchAddressByPostalCode,
): Promise<
  | AddressSearchSuccessResponse
  | AddressSearchErrorResponse
  | ValidationErrorResponse
> => {
  try {
    const valid = validate(request);

    if (!valid) {
      const validationErrors = validate.errors.map((value) => {
        return {
          key: value.instancePath.replace('/', ''),
          reason: value.message,
        };
      });

      return {
        statusCode: HttpStatusCode.unprocessableEntity,
        body: {
          message: 'Unprocessable Entity',
          validationErrors,
        },
      };
    }

    if (request.postalCode === '1000000') {
      return {
        statusCode: HttpStatusCode.badRequest,
        body: {
          code: 'notAllowedPostalCode',
          message: 'not allowed to search by that postalCode',
        },
      };
    }

    const address = await fetchAddressByPostalCode(request.postalCode);

    return {
      statusCode: HttpStatusCode.ok,
      body: address,
    };
  } catch (error) {
    return createErrorResponse(error);
  }
};

const createErrorResponse = (
  error: FetchAddressByPostalCodeError,
): AddressSearchErrorResponse => {
  const errorMessage = error.message as FetchAddressByPostalCodeErrorMessage;

  switch (errorMessage) {
    case 'addressDoseNotFoundError':
      return {
        statusCode: HttpStatusCode.notFound,
        body: {
          code: 'notFoundAddress',
          message: 'address is not found',
        },
      };
    case 'unexpectedError':
      return {
        statusCode: HttpStatusCode.internalServerError,
        body: {
          code: 'unexpectedError',
          message: 'unexpected error',
        },
      };
    default:
      return assertNever(errorMessage);
  }
};

export default addressSearch;
