const router = require('express').Router();
const verifyToken = require('./../middlewares/verifyToken');
const multer = require('multer');
var gm = require('gm');
const fs = require('fs');

const Post = require('./../model/Post');
const collectErrors = require('../helpers/collectErrors').collectErrors;
const customErrors = require('../helpers/collectErrors').customErrors;
const { postCreateValidationSchema } = require('../helpers/validation');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Featured Image must be one of the following: jpeg, jpg, png'), false);
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
});

router.get('/', verifyToken, (_req, res) => {
  res.status(200).json({
    title: 'sadfas',
    description: 'affsfsf',
  })
});

router.post('/', verifyToken, (req, res) => {
  upload.single('featuredImage')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(422).send(customErrors([{ field: "featuredImage", message: err.message }]))
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(422).send(customErrors([{ field: "featuredImage", message: err.message }]))
    }

    gm(req.file.path)
      .gravity('Center') // Move the starting point to the center of the image.
      // .crop(300, 400)
      .write(`uploads/tmp/${req.file.filename}`, (err) => {
        if (err) {
          console.log(err);
        }
      })

    console.log(req.file);
    // Validate before create
    const validation = postCreateValidationSchema(req.body);

    if (validation.error) {
      console.log('validation', validation.error);
      const errors = collectErrors(validation.error);
      return res.status(422).send(errors);
    };

    const post = new Post({
      title: req.body.title,
      description: req.body.description,
      featuredImage: req.file ? req.file.path : ''
    })

    try {
      const savedPost = await post.save();
      const { _id, title, description, featuredImage } = savedPost;
      res.send({ _id, title, description, featuredImage });
    } catch (err) {
      res.status(400).send(err);
    }
  });
});

module.exports = router;