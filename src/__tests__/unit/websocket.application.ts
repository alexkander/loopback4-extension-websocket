import {expect} from '@loopback/testlab';

import {WebsocketBindings} from "../../keys";
import {WebsocketApplication} from '../../websocket.application';
import {givenRunningApplication, TestApplication} from '../fixtures/application';

describe('WebsocketApplication', () => {
  let app: TestApplication;

  before(async () => {
    app = await givenRunningApplication();
  });

  after(async () => {
    await app.stop();
  });

  it('app bind io Server instance', async () => {
    const io = await app.get(WebsocketBindings.SERVER);
    expect(!!io).to.be.true();
  });
});

