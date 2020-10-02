import { expect } from '@loopback/testlab';
import { Constructor } from '@loopback/core';
import { Socket } from 'socket.io';

import { WebsocketApplication } from '../../websocket.application';
import { ControllerWithSubscriberMethods } from '../fixtures/application';
import { WebSocketControllerFactory } from '../../websocket-controller-factory';
import { WebsocketBindings } from '../../keys';
import { DummySocket } from '../fixtures/dummy-socket';

describe('WebSocketControllerFactory', () => {
  let app: WebsocketApplication;
  const getNewFactory = () =>
    new WebSocketControllerFactory(
      app.websocketServer,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ControllerWithSubscriberMethods as Constructor<any>
    );

  before(async () => {
    app = new WebsocketApplication();
  });

  it('must instance a ws controller factory', () => {
    expect(!!getNewFactory()).to.be.true();
  });

  describe('after create WebSocketControllerFactory instance', () => {
    let factory: WebSocketControllerFactory;
    let createdController: unknown;
    const dummySocket = (new DummySocket() as Object) as Socket;

    before(async () => {
      factory = getNewFactory();
      createdController = await factory.createController(dummySocket);
    });

    it('.create must return a instance of controller for a socket connection', () => {
      expect(createdController).to.be.a.instanceOf(
        ControllerWithSubscriberMethods
      );
    });

    it('must bind socket', () => {
      const socket = factory.getSync(WebsocketBindings.SOCKET);
      expect(socket).to.be.equal(dummySocket);
    });

    it('must bind controller constructor', () => {
      const controllerConstructor = factory.getSync(
        WebsocketBindings.CONTROLLER_CONSTRUCTOR
      );
      expect(controllerConstructor).to.be.equal(
        ControllerWithSubscriberMethods
      );
    });

    it('must bind controller instance', () => {
      const controllerInstance = factory.getSync(
        WebsocketBindings.CONTROLLER_INSTANCE
      );
      expect(controllerInstance).to.be.equal(createdController);
    });

    it('get decorated methods for @ws.connect()', () => {
      const methodsForConnection = factory.getDecoratedMethodsForConnect();
      expect(methodsForConnection).to.be.containEql({
        onConnectOne: true,
        onConnectTwo: true,
      });
    });

    it('get decorated methods for @ws.subscription() by string and by regex', () => {
      const methodsResult = factory.getDecorateSubscribeMethodsByEventName();
      expect(methodsResult).to.be.containEql({
        firstEventName1: {
          matcher: 'firstEventName1',
          methodNames: ['firstMethod', 'topMethods'],
        },
        firstEventName2: {
          matcher: 'firstEventName2',
          methodNames: ['firstMethod', 'topMethods'],
        },
        secondEventName: {
          matcher: 'secondEventName',
          methodNames: ['secondMethod', 'topMethods'],
        },
        thirdEventName: {
          matcher: 'thirdEventName',
          methodNames: ['thirdMethod', 'topMethods'],
        },
        disconnect: {
          matcher: 'disconnect',
          methodNames: ['onDisconnect'],
        },
        '/^secondEventName$/': {
          matcher: /^secondEventName$/,
          methodNames: ['secondMethod', 'topMethods'],
        },
        '/^fourthEventName$/': {
          matcher: /^fourthEventName$/,
          methodNames: ['fourthMethod1', 'fourthMethod2'],
        },
        '/^fifthEventName$/': {
          matcher: /^fifthEventName$/,
          methodNames: ['fifthMethod'],
        },
      });
    });

    it('connect decorated methods must has be called', async () => {
      const controller = createdController as ControllerWithSubscriberMethods;
      expect(controller.calledMethods.onConnectOne).to.be.equal(1);
      expect(controller.calledMethods.onConnectTwo).to.be.equal(1);
    });
  });
});
