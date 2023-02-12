import { readFileSync } from 'fs';
import { ListenOptions } from 'net';
import { TLSSocketOptions } from 'tls';

interface Config extends ListenOptions {
    tls?: TLSSocketOptions,
}

export const getOptions = (config): Config => {
    return {
        ...(config.tls ? {
            tls: {
                key: readFileSync(config.tls.key),
                cert: readFileSync(config.tls.cert),
                ca: readFileSync(config.tls.ca),
            },
        } : {}),
        port: config.port,
        host: config.host,
    };
};
