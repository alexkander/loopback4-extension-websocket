import {expect} from '@loopback/testlab';
import io from 'socket.io-client';
import pEvent from 'p-event';
import {
  givenRunningApplication,
  SAMPLE_CONTROLER_ROUTE,
  SampleController,
  TestApplication
} from '../fixtures/application';

describe('SocketIOServer', () => {
  let app: TestApplication;

  before(async () => {
    app = await givenRunningApplication();
    app.websocketServer.controller(SampleController);
  });

  after(async () => {
    await app.stop();
  });

  it('connects to socketio controller ', async () => {
    const url = app.websocketServer.url + SAMPLE_CONTROLER_ROUTE;
    const socket = io(url);
    let err;
    try {
      await pEvent(socket, 'connect');
    } catch (error) {
      err = error;
    }
    expect(!!err).to.be.false();
    socket.disconnect();
  });
});
