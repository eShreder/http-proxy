import { Socket } from 'net';
import { Duplex } from 'stream';

export interface Headers {
    [key: string]: string;
}

export interface HostDesctinationOptions {
    host: string;
    port: number;
}

interface ContextData {
    headers?: Headers;
    isTLS?: boolean;
    destination?: HostDesctinationOptions;

}

/**
 * Context Source socket
 */
interface Context {
    // Source socket
    socket: Socket;
    // Destination socket
    destinationSocket?: Socket;
    reqId: string;
    // Request id on Source socket
    logger?: (...items: any[]) => void;
    // Parsed data
    data: ContextData;
}

type GetterStream = (context: Context) => Duplex
