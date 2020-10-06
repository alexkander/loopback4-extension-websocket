import { Constructor, MetadataAccessor } from '@loopback/context';
export interface WebsocketMetadata {
    name?: string;
    namespace?: string | RegExp;
}
export declare const WEBSOCKET_METADATA: MetadataAccessor<WebsocketMetadata, ClassDecorator>;
export declare const WEBSOCKET_CONNECT_METADATA: MetadataAccessor<boolean, MethodDecorator>;
export declare const WEBSOCKET_SUBSCRIBE_METADATA: MetadataAccessor<(string | RegExp)[], MethodDecorator>;
export declare function getWebsocketMetadata(controllerClass: Constructor<unknown>): WebsocketMetadata | undefined;
export declare namespace ws {
    function socket(): (target: Object, member: string | undefined, methodDescriptorOrParameterIndex?: number | TypedPropertyDescriptor<any> | undefined) => void;
    function io(): (target: Object, member: string | undefined, methodDescriptorOrParameterIndex?: number | TypedPropertyDescriptor<any> | undefined) => void;
    function namespace(name: string): (target: Object, member: string | undefined, methodDescriptorOrParameterIndex?: number | TypedPropertyDescriptor<any> | undefined) => void;
    function controller(spec?: WebsocketMetadata | string | RegExp): ClassDecorator;
    /**
     * Decorate a controller method for `connect`
     */
    function connect(): MethodDecorator;
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
    function subscribe(...messageTypes: (string | RegExp)[]): MethodDecorator;
    /**
     * Decorate a controller method for `disconnect`
     */
    function disconnect(): MethodDecorator;
}
