import { ArtifactOptions, BaseArtifactBooter } from '@loopback/boot';
import { WebsocketApplication } from '../websocket.application';
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
export declare class WebsocketBooter extends BaseArtifactBooter {
    app: WebsocketApplication;
    websocketControllerConfig: ArtifactOptions;
    protected websocketServer: WebsocketServer;
    constructor(app: WebsocketApplication, projectRoot: string, websocketControllerConfig: ArtifactOptions, websocketServer: WebsocketServer);
    /**
     * Uses super method to get a list of Artifact classes. Boot each class by
     * binding it to the application using `app.controller(controller);`.
     */
    load(): Promise<void>;
}
/**
 * Default ArtifactOptions for WebsocketControllerBooter.
 */
export declare const WebsocketControllerDefaults: ArtifactOptions;
