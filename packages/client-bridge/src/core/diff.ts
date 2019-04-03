
import { ToolBuilder, Middleware, CommandBuilder, WindowTool, Context, WindowTools, Handler, CommandEntry, CommandOptions, EventTypeHandler } from './types';
import { observable, toJS, autorun, set, reaction, get, observe, action, runInAction } from 'mobx';

import ContextImpl from './context';
import winUtils from './winutils';
import _ from 'lodash';

import { fromEvent, Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators'


const Types = {
    ON_RECORD: 'onRecord',
    ON_MESSAGE: 'onMessage'
}

/**
 * Everything exposed in this window tool should be considered public
 * these are all of the available operations
 */
export default class Diff implements WindowTool {
    name: string;
    apiKey: string | undefined;
    debugMode: boolean = false;

    private context: Context;

    private postMessageSource?: Observable<Event>


    /**
     * Registered reactions to event types
     */
    private _handlers: Handler[];
    /**
     * Registered actions that can be performed
     * by the diff
     */
    private _commands: CommandEntry;


    constructor(name: string, commands: CommandEntry, handlers: Handler[] = []) {
        this.name = name;
        this.context = new ContextImpl();
        // save our handlers
        this._handlers = handlers;
        this._commands = commands;
    }

    setDebug(mode: boolean) {
        this.debugMode = mode;
    }

    debugMessage(...args: any[]) {
        if (this.debugMode) {
            console.log(...args);
        }
    }

    getFnOptions(): CommandOptions {
        return {
            win: winUtils,
            ctx: this.context
        }
    }

    private configPostMessageHandlers() {


        // Get event listeners
        const onRecordTypes = _.filter(this._handlers, { type: Types.ON_MESSAGE });
        // Convert to a dictionary 
        const eventListener = _.chain(onRecordTypes)
            .reduce((acc: { [val: string]: any }, listener: Handler) => {
                if (!_.has(acc, listener.filter)) {
                    acc[listener.filter] = [listener.func];
                } else {
                    acc[listener.filter].push(listener.func)
                }

                return acc;
            }, {})
            .value();

        const postResponse = (responseType: string) => (val: any) => {
            window.parent.postMessage({
                type: `${responseType}:response`,
                data: val
            }, '*')
        }

        const postMessageSource = fromEvent(window, 'message')
            .pipe(
                tap(evt => this.debugMessage('[diff][MessageHandler]', evt)),
                tap(evt => {
                    const type = _.get(evt, 'data.type');
                    const data = _.get(evt, 'data.data', {});
                    const listeners: EventTypeHandler[] = _.get(eventListener, type, []);
                    listeners.forEach(fn =>
                        fn(data, this.getFnOptions(), postResponse(type))
                    )
                })
            )
            .subscribe();

    }


    private configRecordHandlers() {

        const processRecords = (records: any) => {
            // filter our handlers that perform record type handling
            const onRecordTypes = _.filter(this._handlers, { type: Types.ON_RECORD });

            // filter our records by their type
            records.forEach((entry: any) => {
                _.chain(onRecordTypes)
                    .filter(handler => handler.filter === entry.type)
                    .forEach(handler => handler.func(entry, { win: winUtils }))
                    .value();
            })

        }

        // get our current records
        const records = this.context.state.records;

        // execute handlers against our current records
        processRecords(records);

        // setup our auto runners
        autorun(() => {
            // if we change any then continue to bserve and modify
            records.observe((change: any) => {
                processRecords(change.added)
            })
        })
    }

    private configCommands() {
        // setup commands
        const initCommands = (commands: CommandEntry) => {
            Object.keys(commands).forEach(key => {
                Object.assign(this, {
                    [key]: commands[key]({ ctx: this.context, win: winUtils })
                })
            })
        }

        initCommands(this._commands);
    }


    /**
     * Initializes our client code with an API key
     * and hydrates the expected state of the client
     * 
     */
    init = (apiKey: string, initialState: any = {}): void => {
        // specify our api key
        this.apiKey = apiKey;
        // hydrate our new state
        this.context.replaceState(initialState)
        // config record handlers
        this.configRecordHandlers();
        // config commands
        this.configCommands();
        // config event lsiteners
        this.configPostMessageHandlers();
    }
}