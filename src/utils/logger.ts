import { EventEmitter } from 'stream';

// TODO: add debug logger only with env.DEBUG

export const logger = (...args: any[]) => {
    console.log(`[${Date.now()}]:`, ...args.map(item => typeof item === 'object' ? JSON.stringify(item) : item));
}

export const makeStickLogget = (reqId?: string) => logger.bind({}, `[${reqId || Math.random().toString(32).slice(2)}]`);

export const snifferEvents = (item: EventEmitter, ...labels: string[]) => {
    const origin = item.emit.bind(item);
    item.emit = (event: string | Symbol, ...args: any[]) => {
        logger(...labels.map(label => `[${label}]`), `[event] ${event}`);
        return origin(event, ...args);
    }
}
