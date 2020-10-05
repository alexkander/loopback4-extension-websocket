// Author: Alexander Rondón
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
// Base on: https://github.com/strongloop/loopback-next/blob/master/packages/boot/src/booters/repository.booter.ts

import { config, CoreBindings, inject } from '@loopback/core';
import {
  ArtifactOptions,
  BaseArtifactBooter,
  BootBindings,
  booter,
} from '@loopback/boot';
import { WebsocketApplication } from '../websocket.application';
import { WebsocketBindings } from '../keys';
import { WebsocketServer } from '../websocket.server';

/**
 * A class that extends BaseArtifactBooter to boot the 'WebsocketController' artifact type.
 * Discovered controllers are bound using `app.controller()`.
 *
 * Supported phases: configure, discover, load
 *
 * @param app - Application instance
 * @param projectRoot - Root of User Project relative to which all paths are resolved
 * @param websocketControllerConfig - Controller Artifact Options Object
 */
@booter('websocketControllers')
export class WebsocketBooter extends BaseArtifactBooter {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) public app: WebsocketApplication,
    @inject(BootBindings.PROJECT_ROOT) projectRoot: string,
    @config() public websocketControllerConfig: ArtifactOptions = {},
    @inject(WebsocketBindings.WEBSOCKET_SERVER_CLASS)
    protected websockerServer: WebsocketServer
  ) {
    super(
      projectRoot,
      // Set Controller Booter Options if passed in via bootConfig
      Object.assign({}, WebsocketControllerDefaults, websocketControllerConfig)
    );
  }

  /**
   * Uses super method to get a list of Artifact classes. Boot each class by
   * binding it to the application using `app.controller(controller);`.
   */
  async load() {
    await super.load();
    this.classes.forEach((cls) => {
      this.websockerServer.controller(cls);
    });
  }
}

/**
 * Default ArtifactOptions for WebsocketControllerBooter.
 */
export const WebsocketControllerDefaults: ArtifactOptions = {
  dirs: ['ws-controllers'],
  extensions: ['.controller.js'],
  nested: true,
};
