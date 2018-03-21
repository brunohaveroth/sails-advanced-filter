# sails-advanced-filter

This module uses [waterline-sequel](https://github.com/balderdashy/waterline-sequel) criteriaProcessor.js.
Este módulo utiliza o criteriaProcessor.js do [waterline-sequel](https://github.com/balderdashy/waterline-sequel).

### Módulo permite filtrar registros por valores de colunas de tabelas ligadas por relacionamento.

No exemplo abaixo, o req.query contém uma criteria que tenta filtrar pelo nome do pet, o qual é um relacionamento da tabela User:

```javascript
const AdvancedFilter = require('sails-advanced-filter');

/* req.query:
{
  'firstName': { contains: 'J' },
  'pet.name' : { contains: 'filtro por nome do pet' }
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

Módulo também permite processar a criteria CONCAT, exemplo:

```javascript
/* req.query:
{
  'concat': { 
    fields: ['firstName', 'lastName'] ,
    separator: ' ',
    contains: 'J' // funciona tambem com: startWith, endWith, equal
   }
}
*/

return AdvancedFilter
.findQueryIds(req)
...
```

Neste exemplo o filtro será aplicado na concatenação do firstName com o lastName;
