import { ControllerClass } from '@loopback/core';
import {
  BindingScope,
  Constructor,
  Context,
  MetadataAccessor,
  MetadataInspector,
  invokeMethod,
} from '@loopback/context';
import { Socket } from 'socket.io';
import { WebsocketBindings } from './keys';
import {
  WEBSOCKET_CONNECT_METADATA,
  WEBSOCKET_SUBSCRIBE_METADATA,
} from './decorators/websocket.decorator';
import { DecoratorType, MetadataMap } from '@loopback/metadata/src/types';

export type WebsocketEventMatcherInfo = {
  matcher: string | RegExp;
  methodNames: string[];
  isRegex: boolean;
};

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
  setup(socket: Socket) {
    return this.connect(socket);
  }

  async connect(socket: Socket) {
    const connectMethods = this.getDecoratedMethodsForConnect();
    for (const methodName in connectMethods) {
      await invokeMethod(this.controller, methodName, this, [socket]);
    }
  }

  getDecoratedMethodsForConnect() {
    return this.getAllMethodMetadataForKey(WEBSOCKET_CONNECT_METADATA);
  }

  getDecorateSubscribeMethodsByEventName() {
    const eventsMatchersInfo = new Map<string, WebsocketEventMatcherInfo>();
    const subscribeMethods = this.getDecorateSubscribeMethods();
    for (const methodName in subscribeMethods) {
      for (const matcher of subscribeMethods[methodName]) {
        const matcherString = matcher.toString();
        const eventMatcherInfo = eventsMatchersInfo.get(matcherString) ?? {
          matcher: matcher,
          methodNames: [],
          isRegex: matcher instanceof RegExp,
        };
        eventMatcherInfo.methodNames.push(methodName);
        eventsMatchersInfo.set(matcherString, eventMatcherInfo);
      }
    }
    return eventsMatchersInfo;
  }

  protected getDecorateSubscribeMethods() {
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
