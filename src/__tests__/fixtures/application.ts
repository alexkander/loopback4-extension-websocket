import {ApplicationConfig} from '@loopback/core';

import {ws} from "../../decorators/websocket.decorator";
import {WebsocketApplication} from "../../websocket.application";

export class TestApplication extends WebsocketApplication {
  constructor(options: ApplicationConfig = {}) {
    super(options);
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

export class DummyController {

}

export const SAMPLE_CONTROLER_ROUTE = '/sample/ws';

@ws.controller(SAMPLE_CONTROLER_ROUTE)
export class SampleController {

}
