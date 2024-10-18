import Joi from 'joi';

export const registerUserSchema = Joi.object({
  userName: Joi.string().min(3).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().min(2).max(30).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
