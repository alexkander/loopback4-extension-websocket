import { expect } from '@loopback/testlab';
import { invokeMethod } from '@loopback/context';
import { Namespace, Server, Socket } from 'socket.io';
import { WebsocketApplication } from '../../websocket.application';
import { WebsocketControllerFactory } from '../../websocket-controller-factory';
import { DummySocket } from '../fixtures/dummy-socket';
import { getNewFactory } from '../fixtures/application';
import { ws } from '../../decorators';
import { WebsocketBindings } from '../../keys';

@ws.controller({ name: 'decoratorNsp', namespace: '/decorator/test' })
class DecoratorTestController {
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

describe('WebsocketControllerFactory', () => {
  let app: WebsocketApplication;
  let factory: WebsocketControllerFactory;
  let createdController: unknown;
  let controller: DecoratorTestController;
  let appIo: Server;
  const dummySocket = new DummySocket();

  before(async () => {
    app = new WebsocketApplication();
    app.websocketServer.controller(DecoratorTestController);
    factory = getNewFactory(app, DecoratorTestController);
    createdController = await factory.createController(
      (dummySocket as Object) as Socket
    );
    controller = createdController as DecoratorTestController;
    appIo = await app.get(WebsocketBindings.IO);
  });

  it('@ws.socket must inject the socket connection', async () => {
    const socket: Socket = await invokeMethod(
      controller,
      'methodMustReturnSocket',
      factory
    );
    expect(socket).to.be.equal(dummySocket);
  });

  it('@ws.io must inject SocketIO instance', async () => {
    const io: Server = await invokeMethod(
      controller,
      'methodMustReturnIoInstance',
      factory
    );
    expect(io).to.be.equal(appIo);
  });

  it('@ws.namespace must inject a namespace instance', async () => {
    const expectedNsp = appIo.of('/decorator/test');
    const nsp: Namespace = await invokeMethod(
      controller,
      'methodMustReturnNamespace',
      factory
    );
    expect(nsp).to.be.equal(expectedNsp);
  });
});
