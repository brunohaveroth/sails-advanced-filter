var assert = require('assert');
var pg = require('pg');
var Pack = require('../../../');

describe('Connectable ::', function() {
  describe('Create Manager', function() {
    it('should work without a protocol in the connection string', function(done) {
      Pack.createManager({
        connectionString: 'localhost:5432/mppg'
      })
      .exec(function(err) {
        if (err) {
          return done(err);
        }
        return done();
      });
    });

    it('should successfully return a PG Pool instance (using postgres:// protocol)', function(done) {
      Pack.createManager({
        connectionString: 'postgres://mp:mp@localhost:5432/mppg'
      })
      .exec(function(err, report) {
        if (err) {
          return done(err);
        }

        // Assert that the manager has a pool object
        assert(report.manager.pool);

        // Assert that a PG Pool is returned
        assert(report.manager.pool instanceof pg.Pool);

        // Assert that the manager has a connect function
        assert(report.manager.pool.connect);

        return done();
      });
    });

    it('should successfully return a PG Pool instance (using postgresql:// protocol)', function(done) {
      Pack.createManager({
        connectionString: 'postgresql://mp:mp@localhost:5432/mppg'
      })
      .exec(function(err, report) {
        if (err) {
          return done(err);
        }

        // Assert that the manager has a pool object
        assert(report.manager.pool);

        // Assert that a PG Pool is returned
        assert(report.manager.pool instanceof pg.Pool);

        // Assert that the manager has a connect function
        assert(report.manager.pool.connect);

        return done();
      });
    });
  });
});
