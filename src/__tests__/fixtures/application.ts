import {WebsocketApplication} from '../../websocket.application';
import {ApplicationConfig} from '@loopback/core';

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
