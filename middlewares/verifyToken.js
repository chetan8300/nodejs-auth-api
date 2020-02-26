const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  let token = req.header('Authorization');

  if (!token) return res.status(401).send({
    message: 'Access denied'
  })

  try {
    token = token.replace('Bearer ','');
    const verified = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send({
      message: 'Invalid token'
    });
  }
}

module.exports = auth;