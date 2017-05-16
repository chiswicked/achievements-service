/*!
 * Achievements Service
 * Copyright(c) 2017 Norbert Metz
 * ISC Licensed
 */

const achievements = require('./achievements');
const events = require('./events');
const root = require('./root');
const users = require('./users');

module.exports = {
  achievements,
  events,
  root,
  users,
};
