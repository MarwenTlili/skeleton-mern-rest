import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string()
});
