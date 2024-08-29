import log from 'loglevel';

import graphQLServer from './Server.js';

const PORT = 8080;

log.setLevel(log.levels.INFO);

function getPort(): number {
    if (process.env.PORT == null) {
        return PORT;
    }

    const port = process.env.PORT;

    return parseInt(port);
}

try {
    await graphQLServer(getPort());
}
catch (e) {
    log.error("Fatal error: " + e.message);
    process.exit(1);
}
