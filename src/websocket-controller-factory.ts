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
} from './decorators';
import { DecoratorType, MetadataMap } from '@loopback/metadata/src/types';
import { WebsocketDoneFunction } from './types';

type WebsocketEventMatcherInfo = {
  matcher: string | RegExp;
  methodNames: string[];
};

/* eslint-disable @typescript-eslint/no-misused-promises */
export class WebsocketControllerFactory extends Context {
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
  async setup(socket: Socket) {
    await this.connect(socket);
    this.registerSubscribeMethods(socket);
  }

  async connect(socket: Socket) {
    const connectMethods = this.getDecoratedMethodsForConnect();
    for (const methodName in connectMethods) {
      await invokeMethod(this.controller, methodName, this, [socket]);
    }
  }

  protected registerSubscribeMethods(socket: Socket) {
    const methodsByEventHandler = this.getDecorateSubscribeMethodsByEventName();
    const regexMethodsHandlers = new Map<RegExp, Function[]>();
    const methodHandlers = new Map<String, (...args: unknown[]) => unknown>();
    methodsByEventHandler.forEach((eventMatcherInfo) => {
      const { matcher, methodNames } = eventMatcherInfo;
      methodNames.forEach((methodName) => {
        let handler = methodHandlers.get(methodName);
        if (!handler) {
          handler = this.getCallback(methodName);
          methodHandlers.set(methodName, handler);
        }
        if (matcher instanceof RegExp) {
          const handlers = regexMethodsHandlers.get(matcher) ?? [];
          handlers.push(handler);
          regexMethodsHandlers.set(matcher, handlers);
        } else {
          socket.on(matcher, handler);
        }
      });
    });
    socket.use(async (packet, next) => {
      const [eventName, ...args] = packet;
      for (const iterator of regexMethodsHandlers.entries()) {
        const [regex, handlers] = iterator;
        if (eventName.match(regex)) {
          for (const handler of handlers) {
            await handler(args);
          }
        }
      }
      next();
    });
  }

  getDecoratedMethodsForConnect() {
    return this.getAllMethodMetadataForKey(WEBSOCKET_CONNECT_METADATA);
  }

  getDecorateSubscribeMethodsByEventName() {
    const eventMatchersInfo = new Map<string, WebsocketEventMatcherInfo>();
    const subscribeMethods = this.getDecorateSubscribeMethods();
    for (const methodName in subscribeMethods) {
      for (const matcher of subscribeMethods[methodName]) {
        const matcherString = matcher.toString();
        const eventMatcherInfo = eventMatchersInfo.get(matcherString) ?? {
          matcher: matcher,
          methodNames: [],
        };
        eventMatcherInfo.methodNames.push(methodName);
        eventMatchersInfo.set(matcherString, eventMatcherInfo);
      }
    }
    return eventMatchersInfo;
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

  public getCallback(methodName: string) {
    return async (...args: unknown[]) => {
      let done: WebsocketDoneFunction = async (_response: unknown) => {};
      if (typeof args[args.length - 1] === 'function') {
        done = args.pop() as WebsocketDoneFunction;
      }
      const eventCtx = new Context(this);
      const sequence = await eventCtx.get(WebsocketBindings.SEQUENCE);
      await sequence.handle(methodName, args, done);
    };
  }
}
