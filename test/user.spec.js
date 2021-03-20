var chai = require("chai"),
    expect = chai.expect,
    should = chai.should(),
    supertest = require('supertest'),
    app = require('../app'),
    user = require('../api/controllers/users'),
    UserModel = require('../api/models/users')

describe("Test API - Users", () => {

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

  it('it must create a user', async () => {
    let user = {
      name: '__test__',
      email: new Date().getTime(),
      phone: '__99 9999-9999',
      age: '__99__',
      password: '__123456'
    }

    supertest(app)
      .post('/users')
      .send(user)
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) throw err

        expect(res.statusCode).to.equal(200);

        res.body.should.be.a('object');
        res.body.should.have.property('token').be.a('string');
        res.body.should.have.property('message').eql('User added successfully');
      })
  })

  it("it must log in created user", async () => {
    let { email, password } =  await createUser();

    supertest(app)
      .post('/users/auth')
      .send({ email, password })
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) throw err

        expect(res.statusCode).to.equal(200);

        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('User logged successfully');
        res.body.should.have.property('token').be.a('string');
      })
  })

  it('it must return user info', async () => {
    let { token } =  await createUser();

    supertest(app)
      .get('/users/profile')
      .set("Authorization", "Bearer " + token)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) throw err

        expect(res.statusCode).to.equal(200);

        res.body.should.be.a('object');
        res.body.should.have.property('name').be.a('string');
        res.body.should.have.property('age').be.a('string');
        res.body.should.have.property('email').be.a('string');
        res.body.should.have.property('phone').be.a('string');
      })
  })

  it('it must return all users', async () => {
    let { token } =  await createUser();

    supertest(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) throw err

        expect(res.statusCode).to.equal(200);

        res.body.should.be.a('Object');
        res.body.data.should.have.property('users').be.a('array');
      })
  })

  it('it must update user', async () => {
    let user =  await createUser();

    let data = {
      name: '__test__',
      email: '_' + new Date().getTime(),
      phone: '_99 9999-9999',
      age: '_99__'
    }

    supertest(app)
      .put('/users')
      .send(data)
      .set("Authorization", "Bearer " + user.token)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) throw err

        expect(res.statusCode).to.equal(200);

        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Data updated successfully');
      })
  })

  it('it must delete a user', async () => {
    let { token } =  await createUser();

    supertest(app)
      .delete('/users')
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
  })
})
