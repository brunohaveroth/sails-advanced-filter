# sails-advanced-filter

This module uses [waterline-sequel](https://github.com/balderdashy/waterline-sequel) criteriaProcessor.js.
Este módulo utiliza o criteriaProcessor.js do [waterline-sequel](https://github.com/balderdashy/waterline-sequel).

Módulo permite filtrar registros por valores de colunas de tabelas ligadas por relacionamento.

No exemplo abaixo, o req.query contém uma query que tenta filtrar pelo nome do pet, que é um relacionamento da tabela User:
```javascript
const AdvancedFilter = require('sails-advanced-filter');

/* req.query:
{
  'name': { contains: 'J' },
  'pet.name' : { contains: 'filtro por nome do pet' },
  'address.street' : { contains: 'filtro por nome da rua' }
}
*/

return AdvancedFilter
.findQueryIds(req)
.then((ids)=> {
  /* Se o req.query tem consultas por colunas de tabelas de relacionamento, retorna os ids dos registros
  filtrados, caso contrário apenas retorna o valor req.query sem fazer a consulta.*/
  
  User
  .find(ids)
  .then((users)=> {
    // Registros filtrados
  });
});
```
