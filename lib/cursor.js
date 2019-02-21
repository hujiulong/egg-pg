'use strict';

const Cursor = require('pg-cursor');

function PgCursor(client, sql, values, config){
  this.client = client;
  this.cursor = this.client.query(new Cursor(sql, values));
  this.config = config;
}


PgCursor.prototype.read = function(rowCount){
  const { delay = 0 } = this.config || {};
  return new Promise(resolve => {
    this.cursor.read(rowCount, (err, rows) => {
      if(err){
        this.close();
        throw err;
      }
      setTimeout( () => {
          // 适当的延时可以让
          // 需要发送心跳包等操作得以喘息
          resolve(rows);
      }, delay);
    });
  });
}

PgCursor.prototype.close = function(){
  this.cursor.close(() => {
    this.client.release();
  });
}

module.exports = async (pool, sql, values) => {
  const client = await pool.connect();
  return new PgCursor(client, sql, values);
}

