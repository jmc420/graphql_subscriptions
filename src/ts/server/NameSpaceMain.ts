import 'dotenv/config';
import log from 'loglevel';

import { getAppContext } from './AppContext.js';
import createServer from './NameSpaceServer.js';

const PORT = 8000;

log.setLevel(log.levels.INFO);

function getPort(): number {
    if (process.env.PORT == null) {
        return PORT;
    }

    const port = process.env.PORT;

    return parseInt(port);
}

try {
    await createServer(getPort(), await getAppContext());
}
catch (e) {
    log.error("Fatal error: " + e.message);
    process.exit(1);
}
