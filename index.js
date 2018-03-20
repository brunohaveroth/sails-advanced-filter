const _ = require('lodash');
const CriteriaParser = require('./lib/criteriaProcessor');

module.exports = {
  findQueryIds: function(req) {
    return new Promise(function (resolve, reject) {
      let modelName = req.options.model || req.options.controller;
      let Model = req._sails.models[ modelName.toLowerCase() ];
      let criteriaParser = new CriteriaParser(modelName, Model.definition);

      let parsedCriteria = criteriaParser.read(req.query);
      let query = 'SELECT $tableName.id FROM $tableName $joins WHERE ' + parsedCriteria.query;
      let joins = '';

      if (!parsedCriteria.joins.length && !parsedCriteria.useConcat) return resolve(req.query);

      parsedCriteria.joins = _.uniq(parsedCriteria.joins, 'alias');
      parsedCriteria.joins.forEach((join)=> {
        let tableJoin = join.model,
          tableJoinAlias = join.alias;

        let contentJoin = ' LEFT JOIN $tableJoin $tableJoinAlias ON $tableName.$tableJoinAlias = $tableJoinAlias.id ';

        contentJoin = contentJoin.replace(/\$tableName/g, modelName);
        contentJoin = contentJoin.replace(/\$tableJoinAlias/g, tableJoinAlias);
        contentJoin = contentJoin.replace(/\$tableJoin/g, tableJoin);

        joins += contentJoin;
      });

      query = query.replace(/\$tableName/g, modelName);
      query = query.replace(/\$joins/g, joins);

      parsedCriteria.values.forEach((value, index)=> {
        query = query.replace('$' + (index + 1), value);
      });

      Model.query(query, null, function(err, response) {
        if (err) return reject(err);

        resolve({
          id: _.map(response, 'id')
        });
      });
    });
  }
}
