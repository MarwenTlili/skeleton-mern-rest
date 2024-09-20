import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  roles: Joi.array()
    .items(Joi.string().valid('ADMIN', 'USER'))
    .required(),
  isActive: Joi.boolean(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  lastLoginAt: Joi.date(),
  profilePicture: Joi.string()
});

export const updateUserSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  roles: Joi.array()
    .items(Joi.string().valid('ADMIN', 'USER')),
  isActive: Joi.boolean(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  lastLoginAt: Joi.date(),
  profilePicture: Joi.string()
});
