const chai = require('chai');

chai.should();

const generateTransports = require('../../src/utils/logger').generateTransports;
const log = require('../../src/utils/logger');

describe('Logger', () => {
  it('should return new instance if initialised with no transports (1)', () => {
    log().should.be.an('object');
    log().transports.should.be.empty;
  });
  it('should return new instance if initialised with no transports (2)', () => {
    log([]).should.be.an('object');
    log([]).transports.should.be.empty;
  });
  it('should return new instance if initialised with no transports (3)', () => {
    log(generateTransports('off')).should.be.an('object');
    log(generateTransports('off')).transports.should.be.empty;
  });
  it('should return new instance if initialised with invalid transports', () => {
    log('invalid').should.be.an('object');
    log('invalid').transports.should.be.empty;
  });
  it('should return new instance if initialised with development transports', () => {
    log(generateTransports('development')).should.be.an('object');
    log(generateTransports('development')).transports.should.not.be.empty;
  });
  it('should return new instance if initialised with test transports', () => {
    log(generateTransports('test')).should.be.an('object');
    log(generateTransports('test')).transports.should.be.empty;
  });
  it('should return new instance if initialised with production transports', () => {
    log(generateTransports('production')).should.be.an('object');
    log(generateTransports('production')).transports.should.not.be.empty;
  });
  describe('transports generator', () => {
    it('should return an array with 3 loggers (development)', () => {
      generateTransports('development').should.be.an('array');
      generateTransports('development').should.have.length(3);
    });
    it('should return an empty array (test)', () => {
      generateTransports('test').should.be.an('array');
      generateTransports('test').should.have.length(0);
    });
    it('should return an array with 2 loggers (production)', () => {
      generateTransports('production').should.be.an('array');
      generateTransports('production').should.have.length(2);
    });
    it('should return an empty array (off)', () => {
      generateTransports('off').should.be.an('array');
      generateTransports('off').should.have.length(0);
    });
    it('should return an empty array (undefined)', () => {
      generateTransports('undefined').should.be.an('array');
      generateTransports('undefined').should.have.length(0);
    });
  });
});
