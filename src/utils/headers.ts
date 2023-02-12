import { Headers, HostDesctinationOptions } from '../types';

export const isTLSConnection = (headers: Headers): boolean => headers['CONNECT'] !== undefined;

export const getHeaders = (data: string | Buffer): Headers => {
    return data.toString()
        .split('\r\n')
        .reduce((acc, line) => {
            let [_, header, value] = line.match(/([^\s:]+):?\s([^\n]+)/) || [];

            if (header) {
                acc[header] = value;
            }

            return acc;
        }, {});
}

export const getDestinationServer = (headers: Headers): HostDesctinationOptions => {
    const [host, port] = headers['Host'].split(':');

    return {
        host,
        port: Number(port || '80'),
    };
}
