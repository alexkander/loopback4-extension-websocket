import {expect} from '@loopback/testlab';

import {WebsocketBindings} from "../../keys";
import {WebsocketApplication} from '../../websocket.application';
import {
  DummyController,
  givenRunningApplication,
  SAMPLE_CONTROLER_ROUTE,
  SampleController,
  TestApplication
} from '../fixtures/application';
import {WebSocketServer} from "../../websocket.server";
import {Server} from "socket.io";


describe('WebsocketApplication', () => {
  let app: TestApplication;

  before(async () => {
    app = await givenRunningApplication();
  });

  after(async () => {
    await app.stop();
  });

  it('app bind io Server instance', async () => {
    const io = await app.get(WebsocketBindings.IO);
    expect(!!io).to.be.true();
  });

  it('app bind io Server instance', async () => {
    const websocketServer = await app.websocketServer;
    expect(!!websocketServer).to.be.true();
  });

  describe('app controller registry', () => {

    let io: Server;
    let websocketServer: WebSocketServer;

    before(async () => {
      io = await app.get(WebsocketBindings.IO);
      websocketServer = app.websocketServer;
    });

    it('must return io instance when registry without string route', () => {
      const nsp = websocketServer.controller(DummyController);
      expect(nsp).to.be.equal(io);
    });

    it('must return a nsp when a string route is specific it', () => {
      const stringNamespace = '/route/to/connect';
      const nsp = websocketServer.controller(DummyController, stringNamespace) as any;
      expect(nsp.name).to.be.equal(stringNamespace);
    });

    it('must return a nsp when a regex route is specific it', () => {
      const regexNamespace = /\/regexnamespace/;
      const nsp = websocketServer.controller(DummyController, regexNamespace) as any;
      // TODO: Check namespace regex
      expect(!!nsp.name).to.be.true();
    });

    it('must regsitry bind with the nsp when a name option is specific it', () => {
      const optionsName = 'customName';
      const nsp = websocketServer.controller(DummyController, {name: optionsName}) as any;
      const bindedNsp = app.getSync(WebsocketBindings.getNamespaceKeyForName(optionsName));
      expect(bindedNsp).to.be.equal(nsp);
    });

    it('must return a nsp when a controller setup with ws.controller decorator', () => {
      const nsp = websocketServer.controller(SampleController) as any;
      expect(nsp.name).to.be.equal(SAMPLE_CONTROLER_ROUTE);
    });

  });

});

