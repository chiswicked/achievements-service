const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

const app = require('../src/app');

describe('GET / HTTP/1.1', () => {
  it('should return 200 OK Achievements Service', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.an('object');
        res.text.should.equal('Achievements Service');
        done();
      });
  });
});
