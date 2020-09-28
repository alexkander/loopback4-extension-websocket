import {BindingScope, Constructor, Context,} from '@loopback/context';
import {ControllerClass} from '@loopback/core';
import {Socket} from 'socket.io';
import {WebsocketBindings} from './keys';

/* eslint-disable @typescript-eslint/no-misused-promises */
export class WebSocketControllerFactory extends Context {
  private controller: ControllerClass;

  constructor(
    private parentCtx: Context,
    private controllerClass: Constructor<ControllerClass>,
  ) {
    super(parentCtx);
    this.bind(WebsocketBindings.CONTROLLER_CONSTRUCTOR).to(
      this.controllerClass,
    );
    this.bind(WebsocketBindings.CONTROLLER_CLASS)
      .toClass(this.controllerClass)
      .tag('websocket')
      .inScope(BindingScope.CONTEXT);
  }

  async create(socket: Socket) {
    this.bind(WebsocketBindings.SOCKET).to(socket);
    // Instantiate the controller instance
    this.controller = await this.get(WebsocketBindings.CONTROLLER_CLASS);
    this.bind(WebsocketBindings.CONTROLLER_INSTANCE).to(this.controller);
    await this.setup(socket);
    return this.controller;
  }

  /**
   * Set up the controller for the given socket
   * @param socket
   */
  async setup(socket: Socket) {
  }
}
