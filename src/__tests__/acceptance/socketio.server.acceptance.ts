import { expect } from '@loopback/testlab';
import pEvent from 'p-event';
import {
  ControllerWithSubscriberMethods,
  getNewFactory,
  givenRunningApplication,
  SAMPLE_CONTROLER_ROUTE,
  TestApplication,
  withConnectedSockets,
} from '../fixtures/application';

describe('SocketIOServer', () => {
  let app: TestApplication;

  before(async () => {
    app = await givenRunningApplication();
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

  it('subscribed must be called on', () =>
    withConnectedSockets(
      app,
      SAMPLE_CONTROLER_ROUTE,
      async (client, server) => {
        const factory = getNewFactory(app);
        const createdController: unknown = await factory.createController(
          server
        );
        const controller = createdController as ControllerWithSubscriberMethods;
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
