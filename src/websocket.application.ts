import {ApplicationConfig} from "@loopback/core";
import {RestApplication} from "@loopback/rest";
import {WebsocketComponent} from "./websocket.component";
import {WebsocketBindings} from "./keys";
import {WebSocketServer} from "./websocket.server";

export class WebsocketApplication extends RestApplication {

  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.component(WebsocketComponent);
  }

  get websocketServer(): WebSocketServer {
    return this.getSync<WebSocketServer>(
      WebsocketBindings.WEBSOCKET_SERVER_CLASS,
    );
  }

  public async start(): Promise<void> {
    await this.websocketServer.start();
  }

  public async stop(): Promise<void> {
    await this.websocketServer.stop();
  }

}