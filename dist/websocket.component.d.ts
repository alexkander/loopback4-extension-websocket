import { Application, Component, ProviderMap } from '@loopback/core';
import { WebsocketBooter } from './booters';
export declare class WebsocketComponent implements Component {
    booters: (typeof WebsocketBooter)[];
    providers: ProviderMap;
    constructor(app: Application);
}
