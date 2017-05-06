const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const root = require('../../src/routes/root');

chai.should();
chai.use(sinonChai);

describe('Route /', () => {
  it('should respond with basic text message', () => {
    const spy = sinon.spy();
    root({}, { send: spy });
    spy.should.have.been.calledWith('Achievements Service');
  });
});
