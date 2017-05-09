const chai = require('chai');

const validator = require('../../src/utils/validator').validator;
const validationChain = require('../../src/utils/validator').validationChain;

const should = chai.should();

describe('Validator', () => {
  it('should return a function', () => {
    validator().should.be.a('Function');
  });
  it('should set error code if given one', () => {
    validator(() => true, 'Test message', 123).code.should.equal(123);
  });
  it('should not set error code if given an invalid one', () => {
    should.not.exist(validator(() => true, 'Test message', 'Invalid').code);
  });
  it('should not set error code if not given one', () => {
    should.not.exist(validator(() => true, 'Test message').code);
  });
  it('should set error message if given one (1)', () => {
    validator(() => true, 'Test message', 123).message.should.equal('Test message');
  });
  it('should set error message if given one (2)', () => {
    validator(() => true, 'Test message').message.should.equal('Test message');
  });
  it('should not set error message if not given one', () => {
    should.not.exist(validator(() => true).message);
  });
  describe('instance', () => {
    it('should evaluate true if validator returns true', () => {
      const v = validator(() => true);
      v().should.be.true;
    });
    it('should evaluate false if validator returns false', () => {
      const v = validator(() => false);
      v().should.be.false;
    });
  });
});

describe('Validator chain', () => {
  it('should return a function', () => {
    validationChain().should.be.a('Function');
  });
  describe('instance', () => {
    it('should return empty array if used with no validators', () => {
      const vc = validationChain();
      vc().should.deep.equal([]);
    });
    it('should return empty array if no validator returns false', () => {
      const vc = validationChain(
        validator(() => true, 'Message one', 1),
        validator(() => true, 'Message two', 2));
      vc().should.deep.equal([]);
    });
    it('should return error message and code of the validator that returns false', () => {
      const vc = validationChain(
        validator(() => false, 'Message one', 1),
        validator(() => true, 'Message two', 2),
        validator(() => false, 'Message three', 3));
      vc().should.deep.equal([
        { message: 'Message one', code: 1 },
        { message: 'Message three', code: 3 },
      ]);
    });
  });
});
