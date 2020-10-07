import { Namespace, Server, Socket } from 'socket.io';
export declare const DECORATOR_TEST_CONTROLER_NSP = "/decorators/ws";
export declare class DecoratorTestController {
    methodMustReturnSocket(socket: Socket): Socket;
    methodMustReturnIoInstance(io: Server): Server;
    methodMustReturnNamespace(nsp: Namespace): Namespace;
}
