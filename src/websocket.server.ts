import {
  Application,
  Constructor,
  Context,
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

export type SockIOMiddleware = (
  socket: Socket,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (err?: any) => void
) => void;

export class WebsocketServer extends Context {
  protected io: SocketIO.Server;
  protected _httpServer: HttpServer;

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) public app: Application,
    @inject(WebsocketBindings.CONFIG, { optional: true })
    protected config: WebsocketOptions = {},
    @inject(WebsocketBindings.OPTIONS, { optional: true })
    protected options: ServerOptions = {}
  ) {
    super(app);
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
    const requestListener = this.getSync(WebsocketBindings.REQUEST_LISTENER);
    this._httpServer = new HttpServer(requestListener, this.config);
    await this._httpServer.start();
    this.io.attach(this._httpServer.server, this.options);
  }

  async stop() {
    await new Promise<void>((resolve, _reject) => {
      this.io.close(() => {
        resolve();
      });
    });
    if (this._httpServer) {
      await this._httpServer.stop();
    }
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
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    nsp.on('connection', (socket) =>
      this.createSocketHandler(controllerClass)(socket)
    );
    return nsp;
  }

  protected createSocketHandler(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controllerClass: Constructor<any>
  ) {
    return async (socket: Socket) => {
      debug(
        'Websocket connected: id=%s namespace=%s',
        socket.id,
        socket.nsp.name
      );
      try {
        await new WebsocketControllerFactory(
          this,
          controllerClass,
          socket
        ).createController();
      } catch (err) {
        debug(
          'Websocket error: error creating controller instance con connection',
          err
        );
      }
    };
  }
}
