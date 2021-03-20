var chai = require("chai"),
    expect = chai.expect,
    should = chai.should(),
    supertest = require('supertest'),
    app = require('../app'),
    user = require('../api/controllers/users'),
    BookModel = require('../api/models/books')

describe("Test API - Books", () => {

  /* Creates users and return token */
  const getToken = async () => {
    let newUser = await new Promise((res, rej) => {
      user.create({
        body: {
          name: 'test',
          email: new Date().getTime(),
          phone: '99 9999-9999',
          age: '99',
          password: '123456'
        }
      }, { json: res }, rej)
    })

    return newUser.token
  }

  const createBook = () => {
    let data = {
      name: '_test_name_',
      isbn: '_test_' + new Date().getTime(),
      category: '_test_category_',
      year: '_test_year_'
    }

    return new Promise((response, reject) => response(BookModel.create(data)))
  }

  it("it must return books list", async () => {
    let token =  await getToken();

    supertest(app)
      .get('/books')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) throw err

        expect(res.statusCode).to.equal(200);

        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Books list');
        res.body.should.have.property('data').be.a('Object');
        res.body.data.should.have.property('books').be.a('array');
      })
  })

  it('it must create a book', async () => {
    let token = await getToken()

    let data = {
      name: '_test_name_',
			isbn: '_test_' + new Date().getTime(),
			category: '_test_category_',
			year: '_test_year_'
    }

    supertest(app)
      .post('/books')
      .send(data)
      .set("Authorization", "Bearer " + token)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) throw err

        expect(res.statusCode).to.equal(200);

        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Data added successfully');
        res.body.should.have.property('data').be.a('Object');
        res.body.data.should.have.property('book').be.a('Object');
      })
  })

  it('it must return one book by ID', async () => {
    let token = await getToken(),
        book = await createBook()

    supertest(app)
      .get('/books/' + book._id)
      .set("Authorization", "Bearer " + token)
      .expect('Content-Type', /json/)
      .end((err, resRead) => {
        if (err) throw err

        expect(resRead.statusCode).to.equal(200);

        resRead.body.should.be.a('object');
        resRead.body.should.have.property('message').eql('Book by id');
        resRead.body.should.have.property('data').be.a('Object');
        resRead.body.data.should.have.property('book').be.a('Object');
      })
  })

  it('it must update a book', async () => {
    let token = await getToken(),
        book = await createBook()

    let dataUpdate = {
      isbn: '_test_' + new Date().getTime() + '_',
      category: '__test_new_category__',
    }

    supertest(app)
      .put('/books/' + book._id)
      .send(dataUpdate)
      .set("Authorization", "Bearer " + token)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);

        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Data updated successfully');
        res.body.should.have.property('data').be.a('Object');
        res.body.data.should.have.property('book').be.a('Object');
      })
  })

  it('it must delete a book', async () => {
    let token = await getToken(),
        book = await createBook()

    supertest(app)
      .delete('/books/' + book._id)
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
    /* Delete books created in test */
    BookModel.deleteMany({ name: '_test_name_', year: '_test_year_' });
  })
})
