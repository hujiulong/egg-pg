'use strict';

const pg = require('./lib/pg');

module.exports = agent => {
  if (agent.config.pg.agent) pg(agent);
};
