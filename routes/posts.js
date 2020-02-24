const router = require('express').Router();
const verifyToken = require('./../helpers/verifyToken');

router.get('/', verifyToken, (req, res) => {
  res.status(200).json({
    posts: [
      {
        title: 'sadfas',
        description: 'affsfsf'
      }
    ]
  })
});

module.exports = router;