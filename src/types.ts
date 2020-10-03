import { HttpServerOptions } from '@loopback/http-server';

export type WebsocketOptions = HttpServerOptions;

export interface WebsocketSequence {
  handle(methodName: string, args: unknown[], done: Function): Promise<void>;
}

export type WebsocketDoneFunction = (reponse: unknown) => Promise<void>;

export type WebsocketInvokeMethod = (
  methodName: string,
  args: unknown[]
) => Promise<Object | never>;

export type WebsocketSendMethod = (
  done: Function,
  result: unknown
) => Promise<void>;

export type WebsocketRejectMethod = (
  done: Function,
  error: Error
) => Promise<void>;
