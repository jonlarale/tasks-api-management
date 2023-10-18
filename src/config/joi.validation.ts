import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PROJECT: Joi.string().required(),
  PORT: Joi.number().default(4002),
  HOST: Joi.string().default('localhost'),
  PREFIX: Joi.string().default('api'),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.string().required(),
  PAGINATION_LIMIT: Joi.number().default(10),
  PAGINATION_OFFSET: Joi.number().default(0),
  DOCUMENTATION_PATH: Joi.string().default('docs'),
});
