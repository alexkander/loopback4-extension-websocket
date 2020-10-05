import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { WebsocketBooter } from '../../booters';
import { expect } from '@loopback/testlab';
import { WebsocketApplication } from '../../websocket.application';
import path from 'path';

class BooteablewebsocketApplication extends BootMixin(WebsocketApplication) {
  constructor(options: ApplicationConfig) {
    super(options);
    this.projectRoot = path.join(__dirname, '../fixtures');
  }
}

describe('SocketIOServer', () => {
  const givemeAnInstanceApplicaciontionRunning = async () => {
    const app = new BooteablewebsocketApplication({
      websocket: {
        host: '127.0.0.1',
        port: 0,
      },
    });
    app.booters(WebsocketBooter);
    await app.boot();
    await app.start();
    return app;
  };

  it('boot the applicacion dont must generate a error', async () => {
    let err;
    try {
      await givemeAnInstanceApplicaciontionRunning();
    } catch (error) {
      err = error;
      console.log(err);
    }
    expect(!!err).to.be.false();
  });
});
