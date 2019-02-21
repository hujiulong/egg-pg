'use strict';

const assert = require('assert');
const { Client, Pool } = require('pg');
const newCursor = require('./cursor');

module.exports = app => {
  const { pool } = app.config.pg;
  app.addSingleton(
    'pg',
    createOneClient({
      Factory: pool ? Pool : Client,
    })
  );
};

let count = 0;
function createOneClient({ Factory }) {
  return (config, app) => {
    assert(config.host && config.port && config.user && config.database,
      `[egg-pg] 'host: ${config.host}', 'port: ${config.port}', 'user: ${config.user}', 'database: ${config.database}' are required on config`);

    app.coreLogger.info('[egg-pg] connecting %s@%s:%s/%s',
      config.user, config.host, config.port, config.database);
    const client = new Factory(config);

    client.connect(function(err) {
      if (err) {
        app.coreLogger.error(`[egg-pg] connection failed, ${err.toString()}`);
      }
    });
    app.beforeStart(async function() {
      const result = await client.query('select now() as time;');
      const index = count++;
      app.coreLogger.info(`[egg-pg] instance[${index}] status OK, pg currentTime: ${result.rows[0].time}`);
    });
    client.cursor = (sql, values) => newCursor(client, sql, values);

    return client;
  };
}

