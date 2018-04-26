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
.find(req)
.then((data)=> {
  // Resultado da consulta
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
