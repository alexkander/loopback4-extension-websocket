import { invokeMethod } from '@loopback/context';
import {
  Context,
  ControllerClass,
  CoreBindings,
  inject,
  Provider,
} from '@loopback/core';

import { WebsocketInvokeMethod } from '../types';

export class WebsocketInvokeMethodProvider
  implements Provider<WebsocketInvokeMethod> {
  constructor(
    @inject.context() protected context: Context,
    @inject(CoreBindings.CONTROLLER_CURRENT)
    protected controller: ControllerClass
  ) {}

  value(): WebsocketInvokeMethod {
    return (methodName, args) => this.action(methodName, args);
  }

  async action(methodName: string, args: unknown[]) {
    return invokeMethod(this.controller, methodName, this.context, args);
  }
}
