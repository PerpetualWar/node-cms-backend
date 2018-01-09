require('./config/config');

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user');
const { Post } = require('./models/post');
const { Gallery } = require('./models/gallery');
const { authenticate } = require('./middleware/authenticate');
const { asyncErrorHandler } = require('./middleware/errorHandler');
const { upload } = require('./middleware/upload')

const app = express();
const port = process.env.PORT;

//middlewares
app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


//register new user
app.post('/register', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password', 'first_name', 'last_name', 'role']);
  const user = new User(body);
  try {
    const savedUser = await user.save();
    const token = await user.generateAuthToken(user._id);
    res.header('Authorization', token).send(savedUser);
  } catch (e) {
    res.status(400).send(e);
  }
});

// test authentication
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// login
app.post('/api-token-auth', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  try {
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken(user.id);
    res.header('Authorization', token).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// logout
app.delete('/logout', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send({ message: 'logged out' });
  } catch (e) {
    res.status(400).send(e);
  }
});

//admin
app.get('/admin', authenticate, async (req, res) => {
  const token = jwt.decode(req.token);
  if (token.role !== 'admin')
    return res.send({ message: 'Only admins allowed!' });
  res.send({ message: 'You are allowed as admin' });
  // console.log(token);
});

//posts
app.post('/post', authenticate, async (req, res) => {
  // const body = _.pick(req.body, [])
  const post = new Post({
    post: req.body.post,
    category: req.body.category,
    author: req.user._id,
    tags: req.body.tags
  });
  try {
    const savedPost = await post.save();
    res.send(savedPost);
  } catch (e) {
    res.status(400).send(e);
  }
});

//save pics
app.post('/photos/upload', authenticate, upload.array('photos', 12), async (req, res, next) => {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
  const galleryArr = req.files.map(pic => ({
    image: pic.path,
    name: pic.filename,
    contentType: pic.mimetype,
    galleryName: req.body.galleryName
  }));
  const gallery = new Gallery({
    gallery: galleryArr
  });
  try {
    const savedGallery = await gallery.save();
    res.send(savedGallery);
  } catch (e) {
    res.status(400).send(e);
  }
});

//get galleries
app.get('/photos/:gallery', authenticate, async (req, res) => {
  const galleryName = req.params.gallery;
  try {
    // const photos2 = await Gallery.find({ 'gallery.galleryName': galleryName });
    const photos = await Gallery.aggregate([
      { $unwind: '$gallery' },
      { $match: { 'gallery.galleryName': galleryName } },
    ]);
    res.send(photos);
  } catch (e) {
    res.status(400).send(e);
  }
});

//get pic
app.get('/photos/id/:id', authenticate, async (req, res) => {
  const id = req.params.id;
  const objectId = mongoose.Types.ObjectId(id);
  try {
    const photo = await Gallery.aggregate([
      { $unwind: '$gallery' },
      { $match: { 'gallery._id': objectId } },
    ]);
    // const photo = await Gallery.find({
    //   'gallery._id': id
    // }, {
    //     'gallery.$': 1
    //     // 'gallery': { $elemMatch: { _id: id } }
    //   });
    res.send(photo);
  } catch (e) {
    res.status(400).send(e);
  }
});


// Gets called because of `asyncErrorHandler()` middleware
app.use(function (error, req, res, next) {
  res.json({ message: error.message });
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

module.exports = { app }