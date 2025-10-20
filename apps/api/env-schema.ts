import * as Joi from 'joi';

export const envSchema = Joi.object({
  // Database configuration
  DATABASE_URL: Joi.string()
    .uri({
      scheme: ['postgresql', 'postgres'],
    })
    .required()
    .description('PostgresSQL database connection URL'),

  // JWT configuration
  JWT_SECRET: Joi.string().required().description('JWT secret key'),

  // Redis configuration
  REDIS_URI: Joi.string().uri().required().description('Redis connection URL'),

  ADMIN_FRONTEND_URL: Joi.string()
    .uri()
    .required()
    .description('Admin frontend URL'),

  // Clerk
  CLERK_WEBHOOK_SECRET: Joi.string()
    .required()
    .description('Clerk webhook secret'),

  CLERK_SECRET_KEY: Joi.string().required().description('Clerk secret key'),

  CLERK_PUBLISHABLE_KEY: Joi.string()
    .required()
    .description('Clerk publishable key'),
});
