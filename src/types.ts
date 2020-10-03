import { HttpServerOptions } from '@loopback/http-server';

export type WebsocketOptions = HttpServerOptions;

export interface WebsocketSequence {
  handle(methodName: string, args: unknown[], done: Function): Promise<void>;
}

export type WebsocketDoneFunction = (reponse: unknown) => Promise<void>;
