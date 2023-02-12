import { createServer, Socket } from 'net';
import { createServer as createServerTLS } from 'tls';

import { snifferEvents, makeStickLogget } from './utils/logger';
import { getOptions } from './utils/options';
import { getStream as getParseHeaderStream } from './streams/parseHeaders';
import { getStream as getProxyStream } from './streams/proxy';
import { Context } from './types';
import config from '../config.json';

const options = getOptions(config);

const handleConnection = (socket: Socket) => {
    const reqId = Math.random().toString(32).slice(2);
    const context: Context = {
        reqId,
        socket,
        logger: makeStickLogget(reqId),
        data: {},
        destinationSocket: null,
    };

    snifferEvents(socket,reqId, 'Client');
    socket
        .pipe(getParseHeaderStream(context))
        // TODO: .pipe(getAuthStream(context))
        .pipe(getProxyStream(context))
}

// TODO: write description
const server = options.tls ?
    createServerTLS(options.tls, handleConnection) :
    createServer(handleConnection);

snifferEvents(server, 'Server');
server.listen(options);
