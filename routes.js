// Criando rotas dinamicas com next-routes
// rotas dinamicas é quando a url tem um parametro
const routes = require('next-routes')();

// o ":" significa qualquer coisa após ele será considerado como um endereço dinamico
// o segundo argumento é qual diretório que terá a paginação de endereços dinamicos
routes
    .add('/campaigns/new', '/campaigns/new')
    .add('/campaigns/:address', '/campaigns/show')
    .add('/campaigns/:address/requests', '/campaigns/requests/index')
    .add('/campaigns/:address/requests/new', '/campaigns/requests/new')

module.exports = routes;