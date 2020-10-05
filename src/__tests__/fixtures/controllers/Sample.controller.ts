import { ws } from '../../../decorators';

export const SAMPLE_CONTROLER_ROUTE = '/sample/ws';

@ws.controller(SAMPLE_CONTROLER_ROUTE)
export class SampleController {
  @ws.subscribe('oneEvent')
  oneMethod({ randomNumber }: { randomNumber: number }) {
    return {
      text: `the number is ${randomNumber}`,
    };
  }
}
