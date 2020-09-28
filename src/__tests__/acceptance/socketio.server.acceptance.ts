import {expect} from '@loopback/testlab';
import io from 'socket.io-client';
import pEvent from 'p-event';
import {givenRunningApplication, SAMPLE_CONTROLER_ROUTE, TestApplication} from '../fixtures/application';

describe('SocketIOServer', () => {
  let app: TestApplication;

  before(async () => {
    app = await givenRunningApplication();
  });

  after(async () => {
    await app.stop();
  });

  it('connects ', async () => {
    const url = app.websocketServer.url + SAMPLE_CONTROLER_ROUTE;
    const socket = io(url);
    // const msg = await pEvent(socket, 'connect');
    // expect(msg).to.be.true();
    // socket.disconnect();
  });
});
