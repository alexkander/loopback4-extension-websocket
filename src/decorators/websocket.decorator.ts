import {
  ClassDecoratorFactory,
  Constructor,
  MetadataAccessor,
  MetadataInspector,
} from '@loopback/context';

export interface WebSocketMetadata {
  name?: string;
  namespace?: string | RegExp;
}

export const WEBSOCKET_METADATA = MetadataAccessor.create<
  WebSocketMetadata,
  ClassDecorator
>('websocket');

export function getWebSocketMetadata(controllerClass: Constructor<unknown>) {
  return MetadataInspector.getClassMetadata(
    WEBSOCKET_METADATA,
    controllerClass
  );
}

export namespace ws {
  export function controller(spec: WebSocketMetadata | string | RegExp = {}) {
    if (typeof spec === 'string' || spec instanceof RegExp) {
      spec = { namespace: spec };
    }
    return ClassDecoratorFactory.createDecorator(WEBSOCKET_METADATA, spec);
  }
}
