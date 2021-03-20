var request = require("request"),
    chai = require("chai"),
    expect = chai.expect,
    supertest = require('supertest'),
    app = require('../app');

describe("Test API - index", () => {
  it("it must connect to api index", (done) => {
    supertest(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) =>{
        if (err) done(err);

        expect(res.statusCode).to.equal(200);
      })
      done()
  })
})
