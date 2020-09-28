import {Application, Constructor, Context, CoreBindings, inject} from "@loopback/core";
import {HttpServer} from "@loopback/http-server";
import SocketIO, {ServerOptions} from 'socket.io';
import {WebsocketBindings} from "./keys";
import {WebsocketOptions} from "./types";
import {getWebSocketMetadata, WebSocketMetadata} from "./decorators/websocket.decorator";
import {WebSocketControllerFactory} from "./websocket-controller-factory";

const debug = require('debug')('loopback:websocket');

export class WebSocketServer extends Context {
  protected io: SocketIO.Server;
  protected _httpServer: HttpServer;

  protected options: ServerOptions = {
    origins: ['http://localhost:3000', 'http://localhost:5000'],
  };

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) public app: Application,
    @inject(WebsocketBindings.CONFIG, {optional: true}) config: WebsocketOptions = {},
  ) {
    super(app);
    this._httpServer = new HttpServer(() => {}, config);
    this.io = SocketIO(this.options);
    app.bind(WebsocketBindings.IO).to(this.io);
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

  /**
   * Register a websocket controller
   * @param ControllerClass
   * @param meta
   */
  controller(controllerClass: Constructor<any>, meta?: WebSocketMetadata | string | RegExp) {
    if (meta instanceof RegExp || typeof meta === 'string') {
      meta = {namespace: meta} as WebSocketMetadata;
    }
    if (meta == null) {
      meta = getWebSocketMetadata(controllerClass) as WebSocketMetadata;
    }
    const nsp = meta?.namespace ? this.io.of(meta.namespace) : this.io;
    if (meta?.name) {
      this.app.bind(WebsocketBindings.getNamespaceKeyForName(meta.name)).to(nsp);
    }
    nsp.on('connection', async socket => {
      debug('Websocket connected: id=%s namespace=%s', socket.id, socket.nsp.name);
      await new WebSocketControllerFactory(this, controllerClass).create(
        socket,
      );
    });
    return nsp;

  }

}