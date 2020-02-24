const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./../model/User');
const collectErrors = require('../helpers/collectErrors').default;
const { registerValidationSchema, loginValidationSchema } = require('../helpers/validation');

router.post('/register', async (req, res) => {
  // Validate before create
  const validation = registerValidationSchema(req.body);

  if (validation.error) {
    const errors = collectErrors(validation.error);
    return res.status(422).send(errors)
  };

  // Check if already registered
  const emailExists = await User.findOne({
    email: req.body.email
  });

  if (emailExists) {
    return res.status(422).send({
      validationErrors: [
        {
          "field": "email",
          "message": "Email already exists"
        }
      ]
    });
  }

  // Hash Passwords
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  })

  try {
    const savedUser = await user.save();
    const { _id, name, email } = savedUser;
    res.send({ _id, name, email });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  // Validate before create
  const validation = loginValidationSchema(req.body);

  if (validation.error) {
    const errors = collectErrors(validation.error);
    return res.status(422).send(errors)
  };

  // Check if already registered
  const user = await User.findOne({
    email: req.body.email
  });

  if (!user) {
    return res.status(422).send({
      validationErrors: [
        {
          "field": "email",
          "message": "Email/Password not valid"
        }
      ]
    });
  }

  const validPass = await bcrypt.compare(req.body.password, user.password);

  if(!validPass) {
    return res.status(422).send({
      validationErrors: [
        {
          "field": "password",
          "message": "Email/Password not valid"
        }
      ]
    });
  }

  const { _id, name, email } = user;

  const token = jwt.sign({ _id, name, email }, process.env.JWT_TOKEN_SECRET, { expiresIn: '96h' });

  res.status(200).send({ message: 'Logged in successfully', data: { _id, name, email, token } });
});

module.exports = router;