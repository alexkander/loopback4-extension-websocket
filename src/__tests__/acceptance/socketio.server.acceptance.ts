import { expect } from '@loopback/testlab';
import pEvent from 'p-event';
import { getNewFactory, withConnectedSockets } from '../fixtures/application';
import {
  SAMPLE_CONTROLER_ROUTE,
  SampleController,
} from '../fixtures/controllers/Sample.controller';
import { WithSubscriberMethodsController } from '../fixtures/controllers/WithSubscriberMethods.controller';
import { WebsocketApplication } from '../../websocket.application';

describe('SocketIOServer', () => {
  let app: WebsocketApplication;

  before(async () => {
    app = new WebsocketApplication({
      websocket: {
        host: '127.0.0.1',
        port: 0,
      },
    });
    app.websocketServer.controller(SampleController);
    app.websocketServer.controller(WithSubscriberMethodsController);
    await app.start();
  });

  after(async () => {
    await app.stop();
  });

  it('connects to socketio controller', () =>
    withConnectedSockets(
      app,
      SAMPLE_CONTROLER_ROUTE,
      async (client, _server) => {
        let err;
        try {
          await pEvent(client, 'connect');
        } catch (error) {
          err = error;
        }
        expect(!!err).to.be.false();
      }
    ));

  it('subscribed methods must return the expecto value', () =>
    withConnectedSockets(
      app,
      SAMPLE_CONTROLER_ROUTE,
      async (client, _server) => {
        const randomNumber = 45;

        await pEvent(client, 'connect');

        const result = await new Promise((resolve, _reject) => {
          client.emit('oneEvent', { randomNumber }, resolve);
        });

        expect(result).to.be.equal({
          result: {
            text: `the number is ${randomNumber}`,
          },
        });
      }
    ));

  it('subscribed methods must be called on', () =>
    withConnectedSockets(
      app,
      SAMPLE_CONTROLER_ROUTE,
      async (client, server) => {
        const factory = getNewFactory(app, WithSubscriberMethodsController);
        const createdController: unknown = await factory.createController(
          server
        );
        const controller = createdController as WithSubscriberMethodsController;
        const emitAntWait = async (eventName: string, args: unknown) => {
          client.emit(eventName, args);
          await pEvent(server, eventName);
        };

        await emitAntWait('firstEventName1', []);
        await emitAntWait('firstEventName2', []);
        await emitAntWait('secondEventName', []);
        await emitAntWait('thirdEventName', []);
        await emitAntWait('secondEventName', []);
        await emitAntWait('otherSecondEventName', []);
        await emitAntWait('fourthEventName', []);
        await emitAntWait('fifthEventName', []);

        expect(controller.calledMethods).to.be.containEql({
          onConnectOne: 1,
          onConnectTwo: 1,
          firstMethod: 2,
          secondMethod: 3,
          thirdMethod: 1,
          topMethods: 6,
          onDisconnect: 0,
          fourthMethod1: 1,
          fourthMethod2: 1,
          fifthMethod: 1,
        });
      }
    ));
});
