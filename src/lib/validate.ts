import Joi from 'joi';
import ErrorGenerator from '../domain/common/error';

export const validateContext = (context: any, schema: Joi.Schema) => {
  const validation = schema.validate(context);

  if (validation.error) {
    const errorMessage = validation.error.details[0]?.message;
    const error = ErrorGenerator.badRequest(JSON.stringify(errorMessage));
    throw error;
  }
}