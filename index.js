require('./config/config');

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');
const { asyncErrorHandler } = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT;

//middlewares
app.disable('x-powered-by');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//register new user
app.post('/register', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password', 'first_name', 'last_name']);
  const user = new User(body);
  try {
    const savedUser = await user.save();
    const token = await user.generateAuthToken();
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
    const token = await user.generateAuthToken();
    res.header('Authorization', token).send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});
// logout
app.delete('/logout', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send({ message: 'logged out' });
  } catch (e) {
    res.status(400).send();
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