const chai = require('chai');

chai.should();

const response = require('../../src/utils/response');

describe('Response payload generator', () => {
  describe('Success', () => {
    it('should return an object', () => {
      response.success().should.be.an('object');
    });

    it('should indicate success', () => {
      response.success().should.have.property('success');
      response.success().success.should.be.true;
    });

    it('should have a data object to hold response data', () => {
      response.success().should.have.property('data');
    });

    it('should incorporate string data in payload', () => {
      response.success('payload').data.should.equal('payload');
    });

    it('should incorporate object data in payload', () => {
      response.success({ nested: { payload: 'exists' } })
        .data.nested.payload.should.equal('exists');
    });
  });

  describe('Error', () => {
    it('should return an object', () => {
      response.error().should.be.an('object');
    });

    it('should indicate error', () => {
      response.error().should.have.property('success');
      response.error().success.should.be.false;
    });

    it('should have a data object to hold error desription', () => {
      response.error().should.have.property('error');
    });

    it('should incorporate string data in payload', () => {
      response.error('payload').error.should.equal('payload');
    });

    it('should incorporate object data in payload', () => {
      response.error({ nested: { payload: 'exists' } })
        .error.nested.payload.should.equal('exists');
    });
  });
});
