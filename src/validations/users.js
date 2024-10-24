import Joi from 'joi';

export const updateUserSchema = Joi.object({
  email: Joi.string().email().messages({
    'string.email': 'Email must be a valid email address!',
  }),
  password: Joi.string().messages({
    'string.base': 'Password must be a string.',
  }),
  name: Joi.string().min(3).max(30).messages({
    'string.base': 'name should be a string.',
    'string.min': 'name should be at least {#limit} characters.',
    'string.max': 'name should be at most {#limit} characters.',
  }),
  gender: Joi.string().valid('male', 'female').messages({
    'string.base': 'Gender must be a string.',
    'any.only': 'Gender must be one of {#valids}.',
  }),
  waterRate: Joi.number().min(0).max(15000).messages({
    'number.base': 'Water rate must be a number.',
    'number.min': 'Water rate cannot be less than {#limit}.',
    'number.max': 'Water rate cannot exceed {#limit}.',
  }),
  photo: Joi.string().uri().messages({
    'string.base': 'Photo must be a string.',
    'string.uri': 'Photo must be a valid URI.',
  }),
});
