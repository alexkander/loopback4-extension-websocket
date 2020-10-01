import { Application, ApplicationConfig } from '@loopback/core';
import { WebsocketComponent } from './websocket.component';
import { WebsocketBindings } from './keys';
import { WebSocketServer } from './websocket.server';

export class WebsocketApplication extends Application {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(WebsocketComponent);
  }

  get websocketServer(): WebSocketServer {
    return this.getSync<WebSocketServer>(
      WebsocketBindings.WEBSOCKET_SERVER_CLASS
    );
  }

  public async start(): Promise<void> {
    await this.websocketServer.start();
  }

  public async stop(): Promise<void> {
    await this.websocketServer.stop();
  }
}
