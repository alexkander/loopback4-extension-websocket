import {Context, CoreBindings, inject} from "@loopback/core";
import {HttpServer} from "@loopback/http-server";
import {RestApplication} from "@loopback/rest";
import SocketIO, {ServerOptions} from 'socket.io';
import {WebsocketBindings} from "./keys";
import {WebsocketOptions} from "./types";

export class WebSocketServer extends Context {
  protected io: SocketIO.Server;
  protected _httpServer: HttpServer;

  protected options: ServerOptions = {
    origins: ['http://localhost:3000', 'http://localhost:5000'],
  };

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) public app: RestApplication,
    @inject(WebsocketBindings.CONFIG, {optional: true}) config: WebsocketOptions = {},
  ) {
    super(app);
    this._httpServer = new HttpServer(app.requestHandler, config);
    this.io = SocketIO(this.options);
    app.bind(WebsocketBindings.SERVER).to(this.io);
  }

  get url() {
    return this._httpServer?.url;
  }

  async start() {
    await this._httpServer.start();
    this.io.attach(this._httpServer.server, this.options);
  }

  async stop() {
    const close = new Promise<void>((resolve, reject) => {
      this.io.close(() => {
        resolve();
      });
    });
    await close;
    await this._httpServer.stop();
  }

}