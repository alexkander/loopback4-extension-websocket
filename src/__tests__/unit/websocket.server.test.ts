import { expect } from '@loopback/testlab';
import { Application } from '@loopback/core';
import { WebSocketServer } from '../../websocket.server';
import {
  DummyController,
  SAMPLE_CONTROLER_ROUTE,
  SampleController,
} from '../fixtures/application';
import { WebsocketBindings } from '../../keys';
import { WebsocketComponent } from '../../websocket.component';
import SocketIO, { Namespace } from 'socket.io';

describe('WebsocketServer', () => {
  let io: SocketIO.Server;
  let app: Application, websocketServer: WebSocketServer;

  before(() => {
    app = new Application();
    app.component(WebsocketComponent);
    websocketServer = new WebSocketServer(app);
    io = app.getSync(WebsocketBindings.IO);
  });

  it('app bind io Server instance', async () => {
    expect(!!io).to.be.true();
  });

  it('must return io instance when registry without string route', () => {
    const nsp = websocketServer.controller(DummyController);
    expect(nsp).to.be.equal(io);
  });

  it('must return a nsp when a string route is specific it', () => {
    const stringNamespace = '/route/to/connect';
    const nsp = websocketServer.controller(
      DummyController,
      stringNamespace
    ) as Namespace;
    expect(nsp.name).to.be.equal(stringNamespace);
  });

  it('must return a nsp when a regex route is specific it', () => {
    const regexNamespace = /\/regexnamespace/;
    const nsp = websocketServer.controller(
      DummyController,
      regexNamespace
    ) as Namespace;
    // TODO: Check namespace regex
    expect(!!nsp.name).to.be.true();
  });

  it('must regsitry bind with the nsp when a name option is specific it', () => {
    const optionsName = 'customName';
    const nsp = websocketServer.controller(DummyController, {
      name: optionsName,
    }) as Namespace;
    const bindedNsp = app.getSync(
      WebsocketBindings.getNamespaceKeyForName(optionsName)
    );
    expect(bindedNsp).to.be.equal(nsp);
  });

  it('must return a nsp when a controller setup with ws.controller decorator', () => {
    const nsp = websocketServer.controller(SampleController) as Namespace;
    expect(nsp.name).to.be.equal(SAMPLE_CONTROLER_ROUTE);
  });
});
