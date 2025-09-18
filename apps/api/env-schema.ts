import * as Joi from 'joi';

export const envSchema = Joi.object({
  // Database configuration
  DATABASE_URL: Joi.string()
    .uri({
      scheme: ['postgresql', 'postgres'],
    })
    .required()
    .description('PostgresSQL database connection URL'),
});
