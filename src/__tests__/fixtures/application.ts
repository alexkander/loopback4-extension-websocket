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
  @ws.connect()
  onConnectOne() {}

  @ws.connect()
  onConnectTwo() {}

  @ws.subscribe('firstEventName')
  firstMethod() {}

  @ws.subscribe('secondEventName')
  secondMethod() {}

  @ws.subscribe('thirdEventName')
  thirdMethod() {}

  @ws.disconnect()
  onDisconnect() {}
}
