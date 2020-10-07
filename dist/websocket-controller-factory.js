"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketControllerFactory = exports.WebsocketConnectionContext = void 0;
const core_1 = require("@loopback/core");
const context_1 = require("@loopback/context");
const keys_1 = require("./keys");
const decorators_1 = require("./decorators");
/**
 * Request context for a socket.io request
 */
class WebsocketConnectionContext extends context_1.Context {
    constructor(socket, parent) {
        super(parent);
        this.socket = socket;
    }
}
exports.WebsocketConnectionContext = WebsocketConnectionContext;
/* eslint-disable @typescript-eslint/no-misused-promises */
class WebsocketControllerFactory {
    constructor(parentCtx, controllerClass, socket) {
        this.controllerClass = controllerClass;
        this.connCtx = new WebsocketConnectionContext(socket, parentCtx);
        this.connCtx.bind(keys_1.WebsocketBindings.SOCKET).to(this.connCtx.socket);
        this.connCtx.bind(core_1.CoreBindings.CONTROLLER_CLASS).to(this.controllerClass);
        this.connCtx
            .bind(core_1.CoreBindings.CONTROLLER_CURRENT)
            .toClass(controllerClass)
            .inScope(context_1.BindingScope.SINGLETON);
    }
    async create() {
        // Instantiate the controller instance
        this.controller = await this.connCtx.get(core_1.CoreBindings.CONTROLLER_CURRENT);
        await this.setup();
        return this.controller;
    }
    /**
     * Set up the controller for the given socket
     */
    async setup() {
        await this.connect();
        this.registerSubscribeMethods();
    }
    async connect() {
        const connectMethods = this.getDecoratedMethodsForConnect();
        for (const methodName in connectMethods) {
            await context_1.invokeMethod(this.controller, methodName, this.connCtx, [
                this.connCtx.socket,
            ]);
        }
    }
    registerSubscribeMethods() {
        const methodsByEventHandler = this.getDecorateSubscribeMethodsByEventName();
        const regexMethodsHandlers = new Map();
        const methodHandlers = new Map();
        methodsByEventHandler.forEach((eventMatcherInfo) => {
            const { matcher, methodNames } = eventMatcherInfo;
            methodNames.forEach((methodName) => {
                var _a;
                let handler = methodHandlers.get(methodName);
                if (!handler) {
                    handler = this.getCallback(methodName);
                    methodHandlers.set(methodName, handler);
                }
                if (matcher instanceof RegExp) {
                    const handlers = (_a = regexMethodsHandlers.get(matcher)) !== null && _a !== void 0 ? _a : [];
                    handlers.push(handler);
                    regexMethodsHandlers.set(matcher, handlers);
                }
                else {
                    this.connCtx.socket.on(matcher, handler);
                }
            });
        });
        this.connCtx.socket.use(async (packet, next) => {
            const [eventName, ...args] = packet;
            for (const iterator of regexMethodsHandlers.entries()) {
                const [regex, handlers] = iterator;
                if (eventName.match(regex)) {
                    for (const handler of handlers) {
                        await handler(args);
                    }
                }
            }
            next();
        });
    }
    getDecoratedMethodsForConnect() {
        return this.getAllMethodMetadataForKey(decorators_1.WEBSOCKET_CONNECT_METADATA);
    }
    getDecorateSubscribeMethodsByEventName() {
        var _a;
        const eventMatchersInfo = new Map();
        const subscribeMethods = this.getDecorateSubscribeMethods();
        for (const methodName in subscribeMethods) {
            for (const matcher of subscribeMethods[methodName]) {
                const matcherString = matcher.toString();
                const eventMatcherInfo = (_a = eventMatchersInfo.get(matcherString)) !== null && _a !== void 0 ? _a : {
                    matcher: matcher,
                    methodNames: [],
                };
                eventMatcherInfo.methodNames.push(methodName);
                eventMatchersInfo.set(matcherString, eventMatcherInfo);
            }
        }
        return eventMatchersInfo;
    }
    getDecorateSubscribeMethods() {
        return this.getAllMethodMetadataForKey(decorators_1.WEBSOCKET_SUBSCRIBE_METADATA);
    }
    getAllMethodMetadataForKey(metadataAccessor) {
        var _a;
        return ((_a = context_1.MetadataInspector.getAllMethodMetadata(metadataAccessor, this.controllerClass.prototype)) !== null && _a !== void 0 ? _a : {});
    }
    getCallback(methodName) {
        return async (...args) => {
            let done = async (_response) => { };
            if (typeof args[args.length - 1] === 'function') {
                done = args.pop();
            }
            const eventCtx = new context_1.Context(this.connCtx);
            const sequence = await eventCtx.get(keys_1.WebsocketBindings.SEQUENCE);
            await sequence.handle(methodName, args, done);
        };
    }
}
exports.WebsocketControllerFactory = WebsocketControllerFactory;
//# sourceMappingURL=websocket-controller-factory.js.map