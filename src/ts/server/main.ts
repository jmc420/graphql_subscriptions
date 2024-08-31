import http from 'http';
import log from 'loglevel';

import apolloServer from './ApolloServer.js';
import graphQLHttpServer from './Server.js';

const PORT = 8080;

log.setLevel(log.levels.INFO);

function getPort(): number {
    if (process.env.PORT == null) {
        return PORT;
    }

    const port = process.env.PORT;

    return parseInt(port);
}

function getGraphQLServer(port: number): Promise<http.Server> {
    if (process.argv.filter(arg => arg == "-apollo").length > 0) {
        return apolloServer(port);
    }
    return graphQLHttpServer(port);
}

try {
    await getGraphQLServer(getPort());
}
catch (e) {
    log.error("Fatal error: " + e.message);
    process.exit(1);
}
