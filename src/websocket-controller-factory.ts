import { ControllerClass } from '@loopback/core';
import {
  BindingScope,
  Constructor,
  Context,
  MetadataAccessor,
  MetadataInspector,
} from '@loopback/context';
import { Socket } from 'socket.io';
import { WebsocketBindings } from './keys';
import {
  WEBSOCKET_CONNECT_METADATA,
  WEBSOCKET_SUBSCRIBE_METADATA,
} from './decorators/websocket.decorator';
import { DecoratorType, MetadataMap } from '@loopback/metadata/src/types';

/* eslint-disable @typescript-eslint/no-misused-promises */
export class WebSocketControllerFactory extends Context {
  private controller: ControllerClass;

  constructor(
    private parentCtx: Context,
    private controllerClass: Constructor<ControllerClass>
  ) {
    super(parentCtx);
    this.bind(WebsocketBindings.CONTROLLER_CONSTRUCTOR).to(
      this.controllerClass
    );
    this.bind(WebsocketBindings.CONTROLLER_CLASS)
      .toClass(this.controllerClass)
      .tag('websocket')
      .inScope(BindingScope.CONTEXT);
  }

  async createController(socket: Socket) {
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
  async setup(socket: Socket) {}

  getDecoratedMethodsForConnect() {
    return this.getAllMethodMetadataForKey(WEBSOCKET_CONNECT_METADATA);
  }

  getDecoratedMethodsForSubscription() {
    return this.getAllMethodMetadataForKey(WEBSOCKET_SUBSCRIBE_METADATA);
  }

  protected getAllMethodMetadataForKey<V, DT extends DecoratorType>(
    metadataAccessor: MetadataAccessor<V, DT>
  ): MetadataMap<V> {
    return (
      MetadataInspector.getAllMethodMetadata(
        metadataAccessor,
        this.controllerClass.prototype
      ) ?? ({} as MetadataMap<V>)
    );
  }
}
