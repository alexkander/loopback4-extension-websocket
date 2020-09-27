import {Application, BindingScope, Component, CoreBindings, inject} from '@loopback/core';
import {WebsocketBindings} from "./keys";
import {WebSocketServer} from "./websocket.server";

export class WebsocketComponent implements Component {

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) app: Application,
  ) {
    app
      .bind(WebsocketBindings.WEBSOCKET_SERVER_CLASS)
      .toClass(WebSocketServer)
      .inScope(BindingScope.SINGLETON);
  }

}
