import { ApplicationConfig, Constructor } from '@loopback/core';

import { WebsocketApplication } from '../../websocket.application';
import { WebSocketControllerFactory } from '../../websocket-controller-factory';
import { Socket } from 'socket.io';
import { WebsocketBindings } from '../../keys';
import pEvent from 'p-event';
import io from 'socket.io-client';
import { ws } from '../..';

export class TestApplication extends WebsocketApplication {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.websocketServer.controller(SampleController);
  }
}

export async function givenRunningApplication() {
  const app = new TestApplication({
    websocket: {
      host: '127.0.0.1',
      port: 0,
    },
  });
  await app.start();
  return app;
}

export const withConnectedSockets = async (
  app: TestApplication,
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
  new WebSocketControllerFactory(
    app.websocketServer,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ControllerWithSubscriberMethods as Constructor<any>
  );

export class DummyController {}

export const SAMPLE_CONTROLER_ROUTE = '/sample/ws';

@ws.controller(SAMPLE_CONTROLER_ROUTE)
export class SampleController {}

@ws.controller()
export class ControllerWithSubscriberMethods {
  public calledMethods = {
    onConnectOne: 0,
    onConnectTwo: 0,
    firstMethod: 0,
    secondMethod: 0,
    thirdMethod: 0,
    topMethods: 0,
    onDisconnect: 0,
    fourthMethod1: 0,
    fourthMethod2: 0,
    fifthMethod: 0,
  };
  @ws.connect()
  onConnectOne() {
    this.calledMethods.onConnectOne += 1;
  }

  @ws.connect()
  onConnectTwo() {
    this.calledMethods.onConnectTwo += 1;
  }

  @ws.subscribe('firstEventName1', 'firstEventName2')
  firstMethod() {
    this.calledMethods.firstMethod += 1;
  }

  @ws.subscribe('secondEventName', /^otherSecondEventName$/)
  secondMethod() {
    this.calledMethods.secondMethod += 1;
  }

  @ws.subscribe('thirdEventName')
  thirdMethod() {
    this.calledMethods.thirdMethod += 1;
  }

  @ws.subscribe(
    'firstEventName1',
    'firstEventName2',
    'secondEventName',
    /^otherSecondEventName$/,
    'thirdEventName'
  )
  topMethods() {
    this.calledMethods.topMethods += 1;
  }

  @ws.subscribe(/^fourthEventName$/)
  fourthMethod1() {
    this.calledMethods.fourthMethod1 += 1;
  }

  @ws.subscribe(/^fourthEventName$/)
  fourthMethod2() {
    this.calledMethods.fourthMethod2 += 1;
  }

  @ws.subscribe(/^fifthEventName$/)
  fifthMethod() {
    this.calledMethods.fifthMethod += 1;
  }

  @ws.disconnect()
  onDisconnect() {
    this.calledMethods.onDisconnect += 1;
  }
}
