import { IObservableObject, ObservableMap } from "mobx";

export interface WindowTool {
    name: string;
    init: (apiKey: string, initialState?: {}) => void
}

export interface Middleware {

}

export interface Command {

}

export type EventTypeCallback = (val: any) => void;
export type EventTypeHandler = (val: any, opts: CommandOptions, callback: EventTypeCallback) => void;

export interface ToolBuilder {
    command: (name: string, command: CommandBuilder) => ToolBuilder
    create: () => WindowTool
    onRecordType: (filter: string, cb: Function) => ToolBuilder;
    onEventType: (filter: string, cb?: EventTypeHandler) => ToolBuilder;
}

export interface WindowTools {
    getWidth: () => number;
    [x: string]: any;
}


export interface CommandOptions {
    ctx: Context;
    win: WindowTools;
}

export interface PageMutationOptions extends CommandOptions {

}

export interface Context {
    state: any;
    replaceState: ({ }) => void
}

export type CommandBuilder = (opts: CommandOptions) => Command;

export type AppState = { [s: string]: any };



export interface MutationRecord {
    selector?: string;
    value?: any;
}



export type PageMutationHandler = (record: MutationRecord, env: PageMutationOptions) => void;


export interface Handler {
    type: string;
    filter: string;
    func: Function
}


export type CommandEntry = { [s: string]: CommandBuilder };