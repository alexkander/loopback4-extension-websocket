import { Constructor } from '@loopback/core';
import { Socket } from 'socket.io';
import pEvent from 'p-event';
import io from 'socket.io-client';

import { WebsocketApplication } from '../../websocket.application';
import { WebsocketControllerFactory } from '../../websocket-controller-factory';
import { WebsocketBindings } from '../../keys';
import { WithSubscriberMethodsController } from './controllers/WithSubscriberMethods.controller';

export const withConnectedSockets = async (
  app: WebsocketApplication,
  urlEndpoint: string,
  callbacks: (client: SocketIOClient.Socket, server: Socket) => Promise<void>
) => {
  const url = app.websocketServer.url + urlEndpoint;
  const ioServer = app.getSync(WebsocketBindings.IO);
  const nsp = ioServer.nsps[urlEndpoint];
  const serverPromise = pEvent(nsp, 'connection');
  const socket = io(url);
  const server = await serverPromise;
  await callbacks(socket, server);
  socket.disconnect();
};

export const getNewFactory = (app: WebsocketApplication) =>
  new WebsocketControllerFactory(
    app.websocketServer,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    WithSubscriberMethodsController as Constructor<any>
  );
