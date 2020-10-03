import { invokeMethod } from '@loopback/context';
import { Context, ControllerClass, inject } from '@loopback/core';

import { WebsocketSequence } from './types';
import { WebsocketBindings } from './keys';

export class DefaultWebsocketSequence implements WebsocketSequence {
  constructor(
    @inject.context() protected context: Context,
    @inject(WebsocketBindings.CONTROLLER_INSTANCE)
    protected controller: ControllerClass
  ) {}

  async handle(methodName: string, args: unknown[], done: Function) {
    const response = await invokeMethod(
      this.controller,
      methodName,
      this.context,
      args
    );
    done(response);
  }
}
