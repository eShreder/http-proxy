import { createConnection } from 'net';
import { Duplex } from 'stream'
import { snifferEvents } from '../utils/logger';
import { GetterStream } from '../types';

export const getStream: GetterStream = (context) => {
    return new Duplex({
        write(chunk, _, callback) {
            const {
                socket,
                data: { isTLS, destination },
                logger,
                reqId,
            } = context;
            logger('[proxy] Start', context.data);

            // in any incomprehensible situation, we close everything
            const handleClose = () => {
                context.socket.destroy();
                context.destinationSocket?.destroy();
            }

            // connect to destination server
            context.destinationSocket = createConnection(
                destination,
                () => {
                    logger('[proxy] Destination connected');
                    // if we have connect, this stream should be last
                    socket.unpipe();
                    logger('[proxy] Unpipe');

                    if (isTLS) {
                        socket.write('HTTP/1.1 200 OK\r\n\n');
                    } else {
                        context.destinationSocket.write(chunk);
                    }
                    socket.pipe(context.destinationSocket);
                    context.destinationSocket.pipe(socket);
                }
            );

            context.destinationSocket.on('error', handleClose);
            context.destinationSocket.on('close', handleClose);
            socket.on('error', handleClose);
            socket.on('close', handleClose);

            // for debuggind
            snifferEvents(context.destinationSocket, reqId, 'Destination');
            callback();
        },
        read() {}
    });
}
