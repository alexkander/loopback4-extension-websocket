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
import { getWebsocketMetadata, WebsocketMetadata } from './decorators';
import { WebsocketControllerFactory } from './websocket-controller-factory';

const debug = require('debug')('loopback:websocket');

/* eslint-disable @typescript-eslint/no-explicit-any */
export type SockIOMiddleware = (
  socket: Socket,
  fn: (err?: any) => void
) => void;

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

  /**
   * Register a sock.io middleware function
   * @param fn
   */
  use(fn: SockIOMiddleware) {
    return this.io.use(fn);
  }

  async start() {
    await this._httpServer.start();
    this.io.attach(this._httpServer.server, this.options);
  }

  async stop() {
    await new Promise<void>((resolve, _reject) => {
      this.io.close(() => {
        resolve();
      });
    });
    await this._httpServer.stop();
  }

  /**
   * Register a websocket controller
   * @param controllerClass
   * @param meta
   */
  controller(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controllerClass: Constructor<any>,
    meta?: WebsocketMetadata | string | RegExp
  ): Namespace | SocketIO.Server {
    if (meta instanceof RegExp || typeof meta === 'string') {
      meta = { namespace: meta } as WebsocketMetadata;
    }
    if (meta == null) {
      meta = getWebsocketMetadata(controllerClass) as WebsocketMetadata;
    }
    const nsp = meta?.namespace ? this.io.of(meta.namespace) : this.io;
    if (meta?.name) {
      this.app
        .bind(WebsocketBindings.getNamespaceKeyForName(meta.name))
        .to(nsp);
    }
    nsp.on('connection', (socket) => {
      debug(
        `Websocket connected: id=${socket.id} namespace=${socket.nsp.name}`
      );
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controllerClass: Constructor<any>,
    socket: Socket
  ) {
    debug(
      'Websocket connected: id=%s namespace=%s',
      socket.id,
      socket.nsp.name
    );
    return new WebsocketControllerFactory(
      this,
      controllerClass
    ).createController(socket);
  }
}
