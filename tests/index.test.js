const request = require('supertest');
const { app } = require('../index');
const { users, populateUsers, posts, populatePosts } = require('../tests/seed/seed');

beforeEach(populateUsers);
beforeEach(populatePosts);

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('Authorization', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});
// describe('POST /post', () => {

//   it('should make a new post', (done) => {
//     const post = 'Test any post';
//     const category = 'news';
//     const author = users[0]._id;

//     request(app)
//       .post('/post')
//       .set('Authorization', users[0].tokens[0].token)
//       .send({ post, category, author })
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.post).toBe(post);
//       })
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }
//         Post.find({ post }).then((posts) => {
//           expect(posts.length).toBe(1);
//           expect(posts[0].post).toBe(post);
//           done();
//         }).catch((e) => done(e));
//       });
//   });

// });