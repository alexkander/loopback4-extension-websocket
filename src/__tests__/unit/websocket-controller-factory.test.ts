import { expect } from '@loopback/testlab';
import { ControllerClass } from '@loopback/core';
import { Constructor } from '@loopback/context';
import { WebsocketApplication } from '../../websocket.application';
import { ControllerWithSubscriberMethods } from '../fixtures/application';
import { WebSocketControllerFactory } from '../../websocket-controller-factory';

describe('WebsocketServer', () => {
  let app: WebsocketApplication;
  const getNewFactory = () =>
    new WebSocketControllerFactory(
      app.websocketServer,
      ControllerWithSubscriberMethods as Constructor<ControllerClass>
    );

  before(async () => {
    app = new WebsocketApplication();
  });

  it('must create a ws controller factory', async () => {
    expect(!!getNewFactory()).to.be.true();
  });
});
