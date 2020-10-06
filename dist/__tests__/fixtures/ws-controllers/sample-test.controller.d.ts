import { Socket } from 'socket.io';
export declare const SAMPLE_CONTROLER_NSP = "/sample/ws";
export declare class SampleTestController {
    oneMethod({ randomNumber }: {
        randomNumber: number;
    }): {
        text: string;
    };
    anotherMethod({ randomNumber }: {
        randomNumber: number;
    }, socket: Socket): void;
}
