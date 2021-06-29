import {
  SuccessResponse,
  ErrorResponse,
  ValidationErrorResponse,
  createSuccessResponse,
  createErrorResponse,
  createDefaultResponseHeaders,
} from '../response';
import { FetchAddressByPostalCode } from '../repositories/interfaces/address';
import {
  FetchAddressByPostalCodeError,
  FetchAddressByPostalCodeErrorMessage,
} from '../repositories/errors/fetchAddressByPostalCodeError';
import assertNever from '../utils/assertNever';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { valueOf } from '../utils/valueOf';
import validate from '../validate';
import { AddressSchema } from '../domain/types/schemas/addressSchema';
import { DefaultApiRequest } from '../request';

type Request = DefaultApiRequest & {
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
    postalCode: AddressSchema.postalCode,
  },
  required: ['postalCode'],
  additionalProperties: false,
};

export const addressSearch = async (
  request: Request,
  fetchAddressByPostalCode: FetchAddressByPostalCode,
): Promise<
  | AddressSearchSuccessResponse
  | AddressSearchErrorResponse
  | ValidationErrorResponse
> => {
  try {
    const validateResult = validate<Request>(schema, request);
    if (
      validateResult.isError === true &&
      validateResult.validationErrorResponse
    ) {
      return validateResult.validationErrorResponse;
    }

    if (request.postalCode === '1000000') {
      return createErrorResponse<ErrorCode, ErrorMessage>({
        statusCode: HttpStatusCode.badRequest,
        errorCode: 'notAllowedPostalCode',
        errorMessage: 'not allowed to search by that postalCode',
        headers: createDefaultResponseHeaders(request['x-request-id']),
      });
    }

    const address = await fetchAddressByPostalCode(request.postalCode);

    return createSuccessResponse<ResponseBody>({
      statusCode: HttpStatusCode.ok,
      body: address,
      headers: createDefaultResponseHeaders(request['x-request-id']),
    });
  } catch (error) {
    return createAddressSearchErrorResponse(error, request);
  }
};

const createAddressSearchErrorResponse = (
  error: FetchAddressByPostalCodeError,
  request: Request,
): AddressSearchErrorResponse => {
  const errorMessage = error.message as FetchAddressByPostalCodeErrorMessage;

  switch (errorMessage) {
    case 'addressNotFoundError':
      return createErrorResponse<ErrorCode, ErrorMessage>({
        statusCode: HttpStatusCode.notFound,
        errorCode: 'notFoundAddress',
        errorMessage: 'address is not found',
        headers: createDefaultResponseHeaders(request['x-request-id']),
      });
    case 'unexpectedError':
      return createErrorResponse<ErrorCode, ErrorMessage>({
        statusCode: HttpStatusCode.internalServerError,
        errorCode: 'unexpectedError',
        errorMessage: 'unexpected error',
        headers: createDefaultResponseHeaders(request['x-request-id']),
      });
    default:
      return assertNever(errorMessage);
  }
};

export default addressSearch;
