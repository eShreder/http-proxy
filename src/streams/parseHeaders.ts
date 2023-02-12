import { Duplex } from 'stream';
import { GetterStream } from '../types';
import { getDestinationServer, getHeaders, isTLSConnection } from '../utils/headers';

export const getStream: GetterStream = ({ data }) => {
    let buffer = '';
    return new Duplex({
        write(chunk, _, done) {
            buffer += chunk.toString();
            done();

            if (buffer.indexOf('\r\n\r\n') !== -1) {
                data.headers = getHeaders(buffer);
                data.isTLS = isTLSConnection(data.headers);
                data.destination = getDestinationServer(data.headers);
                this.push(buffer);
                buffer = '';
            }
        },
        read() {}
    });
}
