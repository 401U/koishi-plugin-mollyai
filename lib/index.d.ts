import { Context, Schema } from 'koishi';
export declare const name = "mollyai";
export interface Config {
    apiKey: string;
    apiSecret: string;
    botName: string;
}
export declare const schema: Schema<{
    apiKey?: string;
    apiSecret?: string;
    botName?: string;
} & import("cosmokit").Dict<any, string>, {
    apiKey: string;
    apiSecret: string;
    botName: string;
} & import("cosmokit").Dict<any, string>>;
export declare function apply(ctx: Context, config: Config): void;
