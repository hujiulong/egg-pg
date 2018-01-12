'use strict';

const assert = require('assert');
const { Client } = require('pg');

module.exports = app => {
  app.addSingleton('pg', createOneClient);
};

let count = 0;
function createOneClient(config, app) {
  assert(config.host && config.port && config.user && config.database,
    `[egg-pg] 'host: ${config.host}', 'port: ${config.port}', 'user: ${config.user}', 'database: ${config.database}' are required on config`);

  app.coreLogger.info('[egg-pg] connecting %s@%s:%s/%s',
    config.user, config.host, config.port, config.database);
  const client = new Client(config);

  client.connect(function(err) {
    if (err) {
      app.coreLogger.error(`[egg-pg] connection failed, ${ err.toString() }`);
    }
  });

  app.beforeStart(async function() {
    const result = await client.query('select now() as time;');
    const index = count++;
    app.coreLogger.info(`[egg-pg] instance[${index}] status OK, pg currentTime: ${result.rows[0].time}`);
  });

  return client;
}
