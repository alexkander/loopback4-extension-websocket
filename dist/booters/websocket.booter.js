"use strict";
// Author: Alexander Rondón
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
// Base on: https://github.com/strongloop/loopback-next/blob/master/packages/boot/src/booters/repository.booter.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketControllerDefaults = exports.WebsocketBooter = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const boot_1 = require("@loopback/boot");
const keys_1 = require("../keys");
const websocket_server_1 = require("../websocket.server");
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
let WebsocketBooter = class WebsocketBooter extends boot_1.BaseArtifactBooter {
    constructor(app, projectRoot, websocketControllerConfig = {}, websocketServer) {
        super(projectRoot, 
        // Set Controller Booter Options if passed in via bootConfig
        Object.assign({}, exports.WebsocketControllerDefaults, websocketControllerConfig));
        this.app = app;
        this.websocketControllerConfig = websocketControllerConfig;
        this.websocketServer = websocketServer;
    }
    /**
     * Uses super method to get a list of Artifact classes. Boot each class by
     * binding it to the application using `app.controller(controller);`.
     */
    async load() {
        await super.load();
        const wsServer = await this.app.get(keys_1.WebsocketBindings.SERVER);
        this.classes.forEach((cls) => {
            wsServer.route(cls);
        });
    }
};
WebsocketBooter = tslib_1.__decorate([
    boot_1.booter('websocketControllers'),
    tslib_1.__param(0, core_1.inject(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__param(1, core_1.inject(boot_1.BootBindings.PROJECT_ROOT)),
    tslib_1.__param(2, core_1.config()),
    tslib_1.__param(3, core_1.inject(keys_1.WebsocketBindings.SERVER)),
    tslib_1.__metadata("design:paramtypes", [core_1.Application, String, Object, websocket_server_1.WebsocketServer])
], WebsocketBooter);
exports.WebsocketBooter = WebsocketBooter;
/**
 * Default ArtifactOptions for WebsocketControllerBooter.
 */
exports.WebsocketControllerDefaults = {
    dirs: ['ws-controllers'],
    extensions: ['.controller.js'],
    nested: true,
};
//# sourceMappingURL=websocket.booter.js.map