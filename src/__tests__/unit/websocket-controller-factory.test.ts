import { expect } from '@loopback/testlab';
import { Constructor } from '@loopback/core';
import { Socket } from 'socket.io';

import { WebsocketApplication } from '../../websocket.application';
import { ControllerWithSubscriberMethods } from '../fixtures/application';
import { WebSocketControllerFactory } from '../../websocket-controller-factory';

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

    before(() => {
      factory = getNewFactory();
    });

    it('.create must return a instance of controller for a socket connection', async () => {
      const dummySocket = {} as Socket;
      const controllerInstance = await factory.create(dummySocket);
      expect(controllerInstance).to.be.a.instanceOf(
        ControllerWithSubscriberMethods
      );
    });

    describe('get decorated methods for', () => {
      it('@ws.connect()', () => {
        const methodsForConnection = factory.getDecoratedMethodsForConnect();
        expect(methodsForConnection).to.be.containEql({
          onConnectOne: true,
          onConnectTwo: true,
        });
      });

      it('@ws.subscription() and @ws.disconnect()', () => {
        const regularMethodsForSubscriptions = factory.getDecoratedMethodsForSubscription();
        expect(regularMethodsForSubscriptions).to.be.containEql({
          firstMethod: ['firstEventName'],
          secondMethod: ['secondEventName'],
          thirdMethod: ['thirdEventName'],
          onDisconnect: ['disconnect'],
        });
      });
    });
  });
});
