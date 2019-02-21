# egg-pg

## Install

```bash
$ npm i egg-pg --save
```

PostgreSQL Plugin for egg, support egg application access to PostgreSQL database.

This plugin based on [node-postgres](https://github.com/brianc/node-postgres), if you want to know specific usage, you should refer to the document of [node-postgres](https://github.com/brianc/node-postgres).

## Configuration

Change `${app_root}/config/plugin.js` to enable PostgreSQL plugin:

```js
exports.pg = {
  enable: true,
  package: 'egg-pg',
};
```

Configure database information in `${app_root}/config/config.default.js`:

### Simple database instance

```js
exports.pg = {
  // database configuration
  client: {
    // host
    host: 'pg.com',
    // port
    port: '5432',
    // username
    user: 'test_user',
    // password
    password: 'test_password',
    // database
    database: 'test',    
  },
  // load into app, default is open
  app: true,
  // load into agent, default is close
  agent: false,
  // use pool or client, default is true for pool
  pool: true,
};
```

Usage:

```js
const { rows } = await app.pg.query(sql, values); // you can access to simple database instance by using app.pg.
const { rows } = app.pg.get('db1').query(sql,values); // if there is multiple db
// @see https://node-postgres.com/api/cursor
// if there are large datas to load
const cursor = await app.pg.cursor(sql, values);
while(true){
    const rows = await cursor.read(rowCount); // here we make it resp promise
    if(!rows.length){
        cursor.close();
        break;
    }
    // use the rows here
}
```
e.g:
```js
const { rows } = await app.pg.query('SELECT * FROM core.user WHERE id = $1', [ userId ]);
const { rows } = await app.pg.get('db1').query('SELECT * FROM core.user WHERE id = $1', [ userId ]);

const cursor = await app.pg.cursor('SELECT * FROM core.user WHERE id = $1', [ userId ]);
while(true){
    const rows = await cursor.read(rowCount);
    if(!rows.length){
        cursor.close();
        break;
    }
    // ...
}
```

## License

[MIT](LICENSE)
