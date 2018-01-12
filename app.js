'use strict';

const pg = require('./lib/pg');

module.exports = app => {
  if (app.config.pg.app) pg(app);
};
