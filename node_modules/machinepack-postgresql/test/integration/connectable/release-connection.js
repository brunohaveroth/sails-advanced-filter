var assert = require('assert');
var Pack = require('../../../');

describe('Connectable ::', function() {
  describe('Release Connection', function() {
    var manager;
    var connection;

    // Create a manager and connection
    before(function(done) {
      // Needed to dynamically get the host using the docker container
      var host = process.env.POSTGRES_1_PORT_5432_TCP_ADDR || 'localhost';

      Pack.createManager({
        connectionString: 'postgres://mp:mp@' + host + ':5432/mppg'
      })
      .exec(function(err, report) {
        if (err) {
          return done(err);
        }

        manager = report.manager;

        Pack.getConnection({
          manager: manager
        })
        .exec(function(err, report) {
          if (err) {
            return done(err);
          }

          connection = report.connection;
          return done();
        });
      });
    });

    it('should successfully release a connection', function(done) {
      Pack.releaseConnection({
        connection: connection
      })
      .exec(function(err) {
        if (err) {
          return done(err);
        }

        // If the connection was successfully released the poolSize and the
        // availableObjectsCount should be equal.
        // https://github.com/coopernurse/node-pool#pool-info
        //
        // It's a little bit like inception here digging into manager.manager.pool.pool
        var poolSize = manager.pool.pool.getPoolSize();
        var availableObjects = manager.pool.pool.availableObjectsCount();

        assert.equal(poolSize, availableObjects);

        return done();
      });
    });
  });
});
