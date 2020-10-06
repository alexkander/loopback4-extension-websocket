"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketServer = exports.controllersBindingFilter = exports.getNamespaceKeyForName = exports.NAMESPACE_KEY_FORMAT = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const http_server_1 = require("@loopback/http-server");
const socket_io_1 = tslib_1.__importDefault(require("socket.io"));
const keys_1 = require("./keys");
const decorators_1 = require("./decorators");
const websocket_controller_factory_1 = require("./websocket-controller-factory");
const debug = require('debug')('loopback:websocket');
exports.NAMESPACE_KEY_FORMAT = `ws.namespace.[META_NAME]`;
exports.getNamespaceKeyForName = (name) => exports.NAMESPACE_KEY_FORMAT.split('[META_NAME]').join(name);
/**
 * A binding filter to match socket.io controllers
 * @param binding - Binding object
 */
exports.controllersBindingFilter = (binding) => {
    // It has to be tagged with `controller`
    if (!binding.tagNames.includes(core_1.CoreTags.CONTROLLER))
        return false;
    // It can be explicitly tagged with `socket.io`
    if (binding.tagNames.includes(keys_1.WebsocketTags.SOCKET_IO))
        return true;
    // Now inspect socket.io decorations
    if (binding.valueConstructor) {
        const cls = binding.valueConstructor;
        const classMeta = core_1.MetadataInspector.getClassMetadata(decorators_1.WEBSOCKET_METADATA, cls);
        if (classMeta != null) {
            debug('SocketIO metadata found at class %s', cls.name);
            return true;
        }
        const subscribeMeta = core_1.MetadataInspector.getAllMethodMetadata(decorators_1.WEBSOCKET_SUBSCRIBE_METADATA, cls.prototype);
        if (subscribeMeta != null) {
            debug('SocketIO subscribe metadata found at methods of %s', cls.name);
            return true;
        }
        const connectMeta = core_1.MetadataInspector.getAllMethodMetadata(decorators_1.WEBSOCKET_CONNECT_METADATA, cls.prototype);
        if (connectMeta != null) {
            debug('SocketIO connect metadata found at methods of %s', cls.name);
            return true;
        }
    }
    return false;
};
let WebsocketServer = class WebsocketServer extends core_1.Context {
    constructor(app, config = {}, options = {}) {
        super(app);
        this.app = app;
        this.config = config;
        this.options = options;
        this.io = socket_io_1.default(options);
        this.controllers = this.createView(exports.controllersBindingFilter);
        app.bind(keys_1.WebsocketBindings.IO).to(this.io);
    }
    get url() {
        var _a;
        return (_a = this._httpServer) === null || _a === void 0 ? void 0 : _a.url;
    }
    /**
     * Register a sock.io middleware function
     * @param fn
     */
    use(fn) {
        return this.io.use(fn);
    }
    async start() {
        const requestListener = this.getSync(keys_1.WebsocketBindings.REQUEST_LISTENER);
        this._httpServer = new http_server_1.HttpServer(requestListener, this.config);
        await this._httpServer.start();
        this.io.attach(this._httpServer.server, this.options);
    }
    async stop() {
        await new Promise((resolve, _reject) => {
            this.io.close(() => {
                resolve();
            });
        });
        if (this._httpServer) {
            await this._httpServer.stop();
        }
    }
    /**
     * Register a socketio controller
     * @param controllerClass
     * @param meta
     */
    route(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controllerClass, meta) {
        if (meta instanceof RegExp || typeof meta === 'string') {
            meta = { namespace: meta };
        }
        if (meta == null) {
            meta = decorators_1.getWebsocketMetadata(controllerClass);
        }
        const nsp = (meta === null || meta === void 0 ? void 0 : meta.namespace) ? this.io.of(meta.namespace) : this.io;
        if (meta === null || meta === void 0 ? void 0 : meta.name) {
            this.app.bind(exports.getNamespaceKeyForName(meta.name)).to(nsp);
        }
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        nsp.on('connection', (socket) => this.createSocketHandler(controllerClass)(socket));
        return nsp;
    }
    createSocketHandler(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    controllerClass) {
        return async (socket) => {
            debug('Websocket connected: id=%s namespace=%s', socket.id, socket.nsp.name);
            try {
                await new websocket_controller_factory_1.WebsocketControllerFactory(this, controllerClass, socket).create();
            }
            catch (err) {
                debug('Websocket error: error creating controller instance con connection', err);
            }
        };
    }
    /**
     * Register a socket.io controller
     * @param controllerClass
     */
    controller(controllerClass) {
        debug('Adding controller %s', controllerClass.name);
        const binding = core_1.createBindingFromClass(controllerClass, {
            namespace: keys_1.WebsocketBindings.CONTROLLERS_NAMESPACE,
            defaultScope: core_1.BindingScope.TRANSIENT,
        }).tag(keys_1.WebsocketTags.SOCKET_IO, core_1.CoreTags.CONTROLLER);
        this.add(binding);
        debug('Controller binding: %j', binding);
        return binding;
    }
    /**
     * Discover all socket.io controllers and register routes
     */
    discoverAndRegister() {
        const bindings = this.controllers.bindings;
        for (const binding of bindings) {
            if (binding.valueConstructor) {
                debug('Controller binding found: %s %s', binding.key, binding.valueConstructor.name);
                this.route(binding.valueConstructor);
            }
        }
    }
};
WebsocketServer = tslib_1.__decorate([
    tslib_1.__param(0, core_1.inject(core_1.CoreBindings.APPLICATION_INSTANCE)),
    tslib_1.__param(1, core_1.inject(keys_1.WebsocketBindings.CONFIG, { optional: true })),
    tslib_1.__param(2, core_1.inject(keys_1.WebsocketBindings.OPTIONS, { optional: true })),
    tslib_1.__metadata("design:paramtypes", [core_1.Application, Object, Object])
], WebsocketServer);
exports.WebsocketServer = WebsocketServer;
//# sourceMappingURL=websocket.server.js.map