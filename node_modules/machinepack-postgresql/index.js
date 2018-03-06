// This is a boilerplate file which should not need to be changed.
module.exports = require('machine').pack({
  pkg: require('./package.json'),
  dir: __dirname
});



//... well except for this.
// Also give the driver a `pg` property, so that it provides access
// to the `pg` PostgreSQL library for Node.js. (See http://npmjs.com/package/pg)
module.exports.pg = require('pg');
