const users = require('../../src/routes/users');

describe('Route users.create', () => {
  it('should respond', (done) => {
    const res = {
      send: () => {
        true.should.be.true;
        done();
      },
    };
    users.create({}, res);
  });
});

describe('Route users.read', () => {
  it('should respond', (done) => {
    const res = {
      send: () => {
        true.should.be.true;
        done();
      },
    };
    users.read({}, res);
  });
});

describe('Route users.readAll', () => {
  it('should respond', (done) => {
    const res = {
      send: () => {
        true.should.be.true;
        done();
      },
    };
    users.readAll({}, res);
  });
});

describe('Route users.delete', () => {
  it('should respond', (done) => {
    const res = {
      send: () => {
        true.should.be.true;
        done();
      },
    };
    users.delete({}, res);
  });
});

