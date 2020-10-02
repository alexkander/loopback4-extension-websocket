import { ApplicationConfig } from '@loopback/core';

import { ws } from '../../decorators/websocket.decorator';
import { WebsocketApplication } from '../../websocket.application';

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

export class DummyController {}

export const SAMPLE_CONTROLER_ROUTE = '/sample/ws';

@ws.controller(SAMPLE_CONTROLER_ROUTE)
export class SampleController {}

@ws.controller(SAMPLE_CONTROLER_ROUTE)
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

  @ws.subscribe('secondEventName', /^secondEventName$/)
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
    /^secondEventName$/,
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
