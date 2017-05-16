const events = require('../../src/routes/events');

describe('Route events.create', () => {
  it('should respond', (done) => {
    const res = {
      send: () => {
        true.should.be.true;
        done();
      },
    };
    events.create({}, res);
  });
});

describe('Route events.read', () => {
  it('should respond', (done) => {
    const res = {
      send: () => {
        true.should.be.true;
        done();
      },
    };
    events.read({}, res);
  });
});

describe('Route events.readAll', () => {
  it('should respond', (done) => {
    const res = {
      send: () => {
        true.should.be.true;
        done();
      },
    };
    events.readAll({}, res);
  });
});

describe('Route events.update', () => {
  it('should respond', (done) => {
    const res = {
      send: () => {
        true.should.be.true;
        done();
      },
    };
    events.update({}, res);
  });
});

describe('Route events.delete', () => {
  it('should respond', (done) => {
    const res = {
      send: () => {
        true.should.be.true;
        done();
      },
    };
    events.delete({}, res);
  });
});

describe('Route events.emit', () => {
  it('should respond', (done) => {
    const res = {
      send: () => {
        true.should.be.true;
        done();
      },
    };
    events.emit({}, res);
  });
});
