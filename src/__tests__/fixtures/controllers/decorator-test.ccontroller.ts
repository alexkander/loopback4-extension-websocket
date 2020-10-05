import { Namespace, Server, Socket } from 'socket.io';
import { ws } from '../../../decorators';

@ws.controller({ name: 'decoratorNsp', namespace: '/decorator/test' })
export class DecoratorTestController {
  methodMustReturnSocket(@ws.socket() socket: Socket) {
    return socket;
  }
  methodMustReturnIoInstance(@ws.io() io: Server) {
    return io;
  }
  methodMustReturnNamespace(@ws.namespace('decoratorNsp') nsp: Namespace) {
    return nsp;
  }
}
