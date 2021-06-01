import { Schema } from 'ajv/lib/types/index';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {
  ValidationErrorResponse,
  validationErrorResponseMessage,
} from './Response';
import { HttpStatusCode } from '@constants/HttpStatusCode';

type ValidateResult = {
  isError: boolean;
  validationErrorResponse?: ValidationErrorResponse;
};

const validate = <T>(schema: Schema, params: T): ValidateResult => {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);

  const validateFn = ajv.compile(schema);

  if (!validateFn(params)) {
    const validationErrors = validateFn.errors.map((value) => {
      return {
        key: value.instancePath.replace('/', ''),
        reason: value.message,
      };
    });

    const validationErrorResponse = {
      statusCode: HttpStatusCode.unprocessableEntity,
      body: {
        message: validationErrorResponseMessage(),
        validationErrors,
      },
    };

    return { isError: true, validationErrorResponse };
  }

  return { isError: false };
};

export default validate;
