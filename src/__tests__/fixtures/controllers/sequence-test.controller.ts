import { ws } from '../../../decorators';

@ws.controller('/sequence/nsp')
export class SequenceTestController {
  responseSuccess({ oneParam }: { oneParam: string }) {
    return { text: `yes you are the first params: ${oneParam}` };
  }
  responseError({ badParam }: { badParam: string }) {
    throw new Error(`this is a badParam: ${badParam}`);
  }
}
