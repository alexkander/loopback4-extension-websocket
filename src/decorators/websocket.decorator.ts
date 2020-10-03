import {
  ClassDecoratorFactory,
  Constructor,
  MetadataAccessor,
  MetadataInspector,
  MethodDecoratorFactory,
} from '@loopback/context';

export interface WebsocketMetadata {
  name?: string;
  namespace?: string | RegExp;
}

export const WEBSOCKET_METADATA = MetadataAccessor.create<
  WebsocketMetadata,
  ClassDecorator
>('websocket');

export const WEBSOCKET_CONNECT_METADATA = MetadataAccessor.create<
  boolean,
  MethodDecorator
>('websocket:connect');

export const WEBSOCKET_SUBSCRIBE_METADATA = MetadataAccessor.create<
  (string | RegExp)[],
  MethodDecorator
>('websocket:subscribe');

export function getWebsocketMetadata(controllerClass: Constructor<unknown>) {
  return MetadataInspector.getClassMetadata(
    WEBSOCKET_METADATA,
    controllerClass
  );
}

export namespace ws {
  export function controller(spec: WebsocketMetadata | string | RegExp = {}) {
    if (typeof spec === 'string' || spec instanceof RegExp) {
      spec = { namespace: spec };
    }
    return ClassDecoratorFactory.createDecorator(WEBSOCKET_METADATA, spec);
  }

  /**
   * Decorate a controller method for `connect`
   */
  export function connect() {
    return MethodDecoratorFactory.createDecorator(
      WEBSOCKET_CONNECT_METADATA,
      true
    );
  }

  /**
   * Decorate a method to subscribe to socketio events.
   * For example,
   * ```ts
   * @socketio.subscribe('chat message')
   * async function onChat(msg: string) {
   * }
   * ```
   * @param messageTypes
   */
  export function subscribe(...messageTypes: (string | RegExp)[]) {
    return MethodDecoratorFactory.createDecorator(
      WEBSOCKET_SUBSCRIBE_METADATA,
      messageTypes
    );
  }

  /**
   * Decorate a controller method for `disconnect`
   */
  export function disconnect() {
    return subscribe('disconnect');
  }
}
