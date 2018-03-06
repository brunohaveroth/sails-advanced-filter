var _ = require('@sailshq/lodash');
var debug = require('debug')('query');

module.exports = {


  friendlyName: 'Send native query',


  description: 'Send a native query to the PostgreSQL database.',


  inputs: {

    connection: {
      friendlyName: 'Connection',
      description: 'An active database connection.',
      extendedDescription: 'The provided database connection instance must still be active. Only database ' +
        'connection instances created by the `getConnection()` machine in this driver are supported.',
      example: '===',
      required: true
    },

    nativeQuery: {
      description: 'A native query for the database.',
      extendedDescription: 'If `valuesToEscape` is provided, this supports template syntax like `$1`, `$2`, etc.',
      whereToGet: {
        description: 'Write a native query for this database, or if this driver supports it, use `compileStatement()` to build a native query from Waterline syntax.',
        extendedDescription: 'This might be compiled from a Waterline statement (stage 4 query) using "Compile statement", however it could also originate directly from userland code.'
      },
      example: 'SELECT * FROM pets WHERE species=$1 AND nickname=$2',
      required: true
    },

    valuesToEscape: {
      description: 'An optional list of strings, numbers, or special literals (true, false, or null) to escape and include in the native query, in order.',
      extendedDescription: 'Note that numbers, `true`, `false`, and `null` are all interpreted exactly the same way as if they were wrapped in quotes.  This array must never contain any arrays or dictionaries.  The first value in the list will be used to replace `$1`, the second value to replace `$2`, and so on.',
      example: '===',
      defaultsTo: []
    },

    meta: {
      friendlyName: 'Meta (custom)',
      description: 'Additional stuff to pass to the driver.',
      extendedDescription: 'This is reserved for custom driver-specific extensions. Please refer to the documentation ' +
        'for the driver you are using for more specific information.',
      example: '==='
    }

  },


  exits: {

    success: {
      description: 'The native query was executed successfully.',
      outputVariableName: 'report',
      outputDescription: 'The `result` property is the result data the database sent back. The `meta` property is ' +
        'reserved for custom driver-specific extensions.',
      moreInfoUrl: 'https://github.com/brianc/node-postgres/wiki/Query#result-object',
      example: '==='
      // example: {
      //   result: '===',
      //   meta: '==='
      // }
    },

    queryFailed: {
      description: 'The database returned an error when attempting to execute the native query.',
      outputVariableName: 'report',
      outputDescription: 'The `error` property is a JavaScript Error instance with more details about what went wrong. ' +
        'The `meta` property is reserved for custom driver-specific extensions.',
      example: '==='
      // example: {
      //   error: '===',
      //   meta: '==='
      // }
    },

    badConnection: {
      friendlyName: 'Bad connection',
      description: 'The provided connection is not valid or no longer active. Are you sure it was obtained by calling ' +
        'this driver\'s `getConnection()` method?',
      extendedDescription: 'Usually, this means the connection to the database was lost due to a logic error or timing ' +
        'issue in userland code. In production, this can mean that the database became overwhelemed or was shut off while ' +
          'some business logic was in progress.',
      outputVariableName: 'report',
      outputDescription: 'The `meta` property is reserved for custom driver-specific extensions.',
      example: '==='
      // example: {
      //   meta: '==='
      // }
    }

  },


  fn: function sendNativeQuery(inputs, exits) {
    // Validate provided connection.
    var validConnection = _.isObject(inputs.connection) && _.isFunction(inputs.connection.release) && _.isFunction(inputs.connection.query);
    if (!validConnection) {
      return exits.badConnection();
    }

    // Validate provided native query.
    var sql = inputs.nativeQuery;
    var bindings = inputs.valuesToEscape || [];

    // Send native query.
    debug('Running SQL Query:');
    debug('SQL: ' + sql);
    debug('Bindings: ' + bindings);
    debug('Connection Id: ' + inputs.connection.id);
    inputs.connection.query(sql, bindings, function query(err, result) {
      if (err) {
        return exits.queryFailed({
          error: err,
          meta: inputs.meta
        });
      }

      // While we _could hypothetically_ just return `result.rows`, for
      // completeness we currently include the other (albeit less-documented)
      // properties sent back on `result` from node-postgres; e.g. `oid`.
      //
      // For more information, see:
      //  • https://github.com/brianc/node-postgres/wiki/Query#result-object
      return exits.success({
        result: {
          command: result.command,
          rowCount: result.rowCount,
          oid: result.oid,
          rows: result.rows
        },
        meta: inputs.meta
      });
    });
  }


};
