const router = require('express').Router();

const User = require('./../model/User');
const { registerValidationSchema, loginValidationSchema } = require('../validation');

router.post('/register', async (req, res) => {
  // Validate before create
  const validation = registerValidationSchema(req.body);

  if (validation.error) return res.status(422).send(validation);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  // Validate before create
  const validation = loginValidationSchema(req.body);

  if (validation.error) return res.status(422).send(validation);

  const user = User.findOne({
    email: req.body.email
  });
});

module.exports = router;