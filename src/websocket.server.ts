import {
  Application,
  Constructor,
  Context,
  ControllerClass,
  CoreBindings,
  inject,
} from '@loopback/core';
import { HttpServer } from '@loopback/http-server';
import SocketIO, { Namespace, ServerOptions, Socket } from 'socket.io';
import { WebsocketBindings } from './keys';
import { WebsocketOptions } from './types';
import {
  getWebSocketMetadata,
  WebSocketMetadata,
} from './decorators/websocket.decorator';
import { WebSocketControllerFactory } from './websocket-controller-factory';

const debug = require('debug')('loopback:websocket');

export class WebSocketServer extends Context {
  protected io: SocketIO.Server;
  protected _httpServer: HttpServer;

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) public app: Application,
    @inject(WebsocketBindings.CONFIG, { optional: true })
    config: WebsocketOptions = {},
    @inject(WebsocketBindings.OPTIONS, { optional: true })
    protected options: ServerOptions = {}
  ) {
    super(app);
    const requestListener = this.getSync(WebsocketBindings.REQUEST_LISTENER);
    this._httpServer = new HttpServer(requestListener, config);
    this.io = SocketIO(options);
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
  controller(
    controllerClass: Constructor<unknown>,
    meta?: WebSocketMetadata | string | RegExp
  ): Namespace | SocketIO.Server {
    if (meta instanceof RegExp || typeof meta === 'string') {
      meta = { namespace: meta } as WebSocketMetadata;
    }
    if (meta == null) {
      meta = getWebSocketMetadata(controllerClass) as WebSocketMetadata;
    }
    const nsp = meta?.namespace ? this.io.of(meta.namespace) : this.io;
    if (meta?.name) {
      this.app
        .bind(WebsocketBindings.getNamespaceKeyForName(meta.name))
        .to(nsp);
    }
    nsp.on('connection', (socket) => {
      this.createControllerInstanceForSocket(
        controllerClass as Constructor<ControllerClass>,
        socket
      ).catch((err) => {
        debug(
          'Websocket error: error creating controller instance con connection',
          err
        );
      });
    });
    return nsp;
  }

  protected createControllerInstanceForSocket(
    controllerClass: Constructor<ControllerClass>,
    socket: Socket
  ) {
    debug(
      'Websocket connected: id=%s namespace=%s',
      socket.id,
      socket.nsp.name
    );
    return new WebSocketControllerFactory(this, controllerClass).create(socket);
  }
}
