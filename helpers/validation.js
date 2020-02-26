
// Import Joi for Validation
const Joi = require('@hapi/joi');

// User register validation schema
const registerValidationSchema = data => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(7).alphanum().required(),
  });

  return schema.validate(data, { abortEarly: false });
};

// User login validation schema
const loginValidationSchema = data => {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(7).alphanum().required(),
  });

  return schema.validate(data, { abortEarly: false });
};

// Post create validation schema
const postCreateValidationSchema = data => {
  const schema = Joi.object({
    title: Joi.string().min(8).required(),
    description: Joi.string().min(7).required(),
    image: Joi.any()
              .meta({swaggerType: 'file'})
              .optional()
              .allow('')
              .description('image file'),
  });

  return schema.validate(data, { abortEarly: false });
}

module.exports = {
  registerValidationSchema,
  loginValidationSchema,
  postCreateValidationSchema,
}

