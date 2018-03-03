const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Post } = require('../../models/post');
const { User } = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'srle@srle123.com',
  password: 'userOnePass',
  first_name: 'Srle',
  last_name: 'Medjo',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
  }]
}, {
  _id: userTwoId,
  email: 'vanja@vanja123.com',
  password: 'userTwoPass',
  first_name: 'Vanja',
  last_name: 'Medjo',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userTwoId, access: 'auth' }, 'abc123').toString()
  }]
}];

const posts = [{
  _id: new ObjectID(),
  post: 'some text',
  tags: ['err', 'sds'],
  category: 'news',
  author: userOneId
}, {
  _id: new ObjectID(),
  post: 'some text 2',
  category: 'comments',
  author: userTwoId
}];

const populatePosts = (done) => {
  Post.remove({}).then(() => {
    return Post.insertMany(posts);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = { posts, populatePosts, users, populateUsers };