const achievements = require('../../src/routes/achievements');

describe('Route achievements.create', () => {
  it('should respond', (done) => {
    const res = {
      send: () => {
        true.should.be.true;
        done();
      },
    };
    achievements.create({}, res);
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
    achievements.readAll({}, res);
  });
});
