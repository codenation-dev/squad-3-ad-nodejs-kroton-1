import express from 'express';
// Importa as rotas do arquivo "routes.js". Assim o método "routes" da classe "App" pode usar a variável "server"
//  do método "constructor" que recebeu o Express,.
import routes from './routes';

class App {
    // Método "constructor" é executado toda vez que a classe App for chamada
    constructor() {
        // A variável "server" recebe a função "express()". Cria uma aplicação Express.
        this.server = express();

        this.middlewares();

        this.routes();
    }
    // Método que possibilita enviar requisições e receber respostas no formato de json.
    middlewares() {
        this.server.use(express.json());
    }
    // Método que irá receber a variavel "routes" importada do arquivo "routes.js"
    routes() {
        this.server.use(routes);
    }
}

// Instancia a class App. Exporta apenas a variável server.
export default new App().server;