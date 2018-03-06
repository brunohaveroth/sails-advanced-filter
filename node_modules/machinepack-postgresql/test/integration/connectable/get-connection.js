var assert = require('assert');
var pg = require('pg');
var Pack = require('../../../');

describe('Connectable ::', function() {
  describe('Get Connection', function() {
    var manager;

    // Create a manager
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
        return done();
      });
    });

    it('should successfully return a PG Client instance', function(done) {
      Pack.getConnection({
        manager: manager
      })
      .exec(function(err, report) {
        if (err) {
          return done(err);
        }

        // Assert that the report has a client object
        assert(report.connection);

        // Assert that a PG Client is returned
        assert(report.connection instanceof pg.Client);

        // Assert that the connection has a release function
        assert(report.connection.release);

        return done();
      });
    });
  });
});
