const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const morgan = require('morgan');
const helmet = require('helmet');

const { typeDefs, resolvers } = require('./graphql/schema');

async function startServer() {
    const app = express();

    app.use(helmet());
    app.use(morgan('dev'));

    // Middleware para prettify JSON
    app.set('json spaces', 2); // Para res.json()
    app.use((req, res, next) => {
        const oldJson = res.json;
        res.json = function (data) {
            const body = JSON.stringify(data, null, 2); // 2 espacios de sangría
            res.set('Content-Type', 'application/json');
            res.send(body);
        };
        next();
    });

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });

    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`Servidor GraphQL en http://localhost:${PORT}/graphql`);
    });
}

startServer();
