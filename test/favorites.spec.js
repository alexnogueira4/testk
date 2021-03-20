var chai = require("chai"),
    expect = chai.expect,
    should = chai.should(),
    supertest = require('supertest'),
    app = require('../app'),
    user = require('../api/controllers/users'),
    UserModel = require('../api/models/users'),
    BookModel = require('../api/models/books')
    FavoriteModel = require('../api/models/favorites')

describe("Test API - Favorite Books", () => {

  /* Creates users and return token */
  const createUser = async () => {
    let data = {
      name: '__test__',
      email: new Date().getTime(),
      phone: '__99 9999-9999',
      age: '__99__',
      password: '__123456'
    }

    let { token } = await new Promise((response, reject) => user.create({ body: data }, {json: response}, reject) )

    return { ...data, token }
  }

  const getUserId = email => new Promise((response, reject) => response(UserModel.findOne({ email })))

  const createFavoriteBook = data => new Promise((response, reject) => response(FavoriteModel.create(data)))

  const getBook = () => {
    let data = {
      name: '__test_name',
      isbn: '__test_' + new Date().getTime(),
      category: '__test_category',
      year: '__test_year'
    }

    return new Promise((response, reject) => response(BookModel.create(data)))
  }

  it('it must create a favorite book of a user', async () => {
    let { token } = await createUser();
    let book = await getBook()

    supertest(app)
      .post('/favorites')
      .send(book)
      .set("Authorization", "Bearer " + token)
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) throw err

        expect(res.statusCode).to.equal(200);

        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Data created successfully');
      })
  })

  it('it must get a list of user\'s favorite books', async () => {
    let { email, token } = await createUser();
    let {_id: userId} = await getUserId(email);
    let book = await getBook()

    supertest(app)
      .get('/favorites')
      .query(userId)
      .set("Authorization", "Bearer " + token)
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) throw err

        expect(res.statusCode).to.equal(200);

        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Favorite Books list');
      })
  })

  it('it must delete a favorite book', async () => {
    let { email, token } = await createUser(),
        { _id: user } = await getUserId(email),
        { _id: book } = await getBook(),
        { book: favoriteId } = await createFavoriteBook({user, book})

    supertest(app)
      .delete('/favorites/' + favoriteId)
      .set("Authorization", "Bearer " + token)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) throw err

        expect(res.statusCode).to.equal(200);

        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Data deleted successfully');
      })
  })

  after(() => {
    /* Delete users created in test */
    UserModel.deleteMany({ name: '__test__', age: '__99__' });
    /* Delete Books created in test */
    BookModel.deleteMany({ name: '__test_name', year: '__test_year' });
  })
})
