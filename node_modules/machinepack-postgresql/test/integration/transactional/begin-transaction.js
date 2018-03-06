var assert = require('assert');
var _ = require('@sailshq/lodash');
var Pack = require('../../../');

describe('Transactional ::', function() {
  describe('Begin Transaction', function() {
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

        // Store the manager
        manager = report.manager;

        Pack.getConnection({
          manager: manager
        })
        .exec(function(err, report) {
          if (err) {
            return done(err);
          }

          // Store the connection
          connection = report.connection;

          return done();
        });
      });
    });

    // Afterwards close the transaction and release the connection
    after(function(done) {
      Pack.sendNativeQuery({
        connection: connection,
        nativeQuery: 'ROLLBACK;'
      })
      .exec(function(err) {
        if (err) {
          return done(err);
        }

        Pack.releaseConnection({
          connection: connection
        }).exec(done);
      });
    });

    it('should send a query that starts a transaction on the current connection', function(done) {
      // Check if a transaction is currently open
      Pack.sendNativeQuery({
        connection: connection,
        nativeQuery: 'select txid_current();'
      })
      .exec(function(err, report) {
        if (err) {
          return done(err);
        }

        var startingTxId = _.first(report.result.rows).txid_current;

        // Open a Transaction using the machine
        Pack.beginTransaction({
          connection: connection
        })
        .exec(function(err) {
          if (err) {
            return done(err);
          }

          // Get the updated transaction id
          Pack.sendNativeQuery({
            connection: connection,
            nativeQuery: 'select txid_current();'
          })
          .exec(function(err, report) {
            if (err) {
              return done(err);
            }

            var currentTxId = _.first(report.result.rows).txid_current;

            // Get another transaction id
            Pack.sendNativeQuery({
              connection: connection,
              nativeQuery: 'select txid_current();'
            })
            .exec(function(err, report) {
              if (err) {
                return done(err);
              }

              var afterTxId = _.first(report.result.rows).txid_current;

              // The first two transaction id's should be different.
              // This should show that a transaction was NOT in progress.
              assert.notEqual(startingTxId, currentTxId);

              // The last two transaction id's should be the same. This should
              // show that a transaction was opened.
              assert.equal(currentTxId, afterTxId);

              return done();
            });
          });
        });
      });
    });
  });
});
