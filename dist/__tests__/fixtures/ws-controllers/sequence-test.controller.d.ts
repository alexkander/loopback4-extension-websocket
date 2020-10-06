export declare const SEQUENCE_TEST_CONTROLER_NSP = "/sequences/ws";
export declare class SequenceTestController {
    responseSuccess({ oneParam }: {
        oneParam: string;
    }): {
        text: string;
    };
    responseError({ badParam }: {
        badParam: string;
    }): void;
}
