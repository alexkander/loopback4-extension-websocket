import { invokeMethod } from '@loopback/context';
import { Context, ControllerClass, inject, Provider } from '@loopback/core';

import { WebsocketBindings } from '../keys';
import { WebsocketInvokeMethod } from '../types';

export class WebsocketInvokeMethodProvider
  implements Provider<WebsocketInvokeMethod> {
  constructor(
    @inject.context() protected context: Context,
    @inject(WebsocketBindings.CONTROLLER_INSTANCE)
    protected controller: ControllerClass
  ) {}

  value(): WebsocketInvokeMethod {
    return (methodName, args) => this.action(methodName, args);
  }

  async action(methodName: string, args: unknown[]) {
    return invokeMethod(this.controller, methodName, this.context, args);
  }
}
