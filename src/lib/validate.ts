import Joi from 'joi';
import ErrorGenerator from '../domain/common/error';

export const validateContext = (context: any, schema: Joi.Schema) => {
  const validation = schema.validate(context);

  if (validation.error) {
    const errorMessage = validation.error.message.replaceAll(/['"\\]+/g, '')
    const error = ErrorGenerator.badRequest(errorMessage);
    throw error;
  }
}