import { ToolBuilder, Middleware, CommandBuilder, WindowTool, Context, WindowTools, CommandEntry, Handler } from './types';
import Diff from './diff'



/**
 * Just a chaining function that allows you to add 
 * to the internal datamodel that is used by diff
 */
export default class ToolBuilderImplementation implements ToolBuilder {
    private name: string;
    private commands: CommandEntry = {};
    private handlers: Handler[] = [];

    constructor(name: string) {
        this.name = name;
    }

    command(name: string, command: CommandBuilder) {
        this.commands = {
            ...this.commands,
            [name]: command
        }
        return this;
    }

    create() {
        return new Diff(this.name, this.commands, this.handlers);
    }

    onRecordType(filter: string, cb: Function) {
        this.handlers.push({
            type: 'onRecord',
            filter,
            func: cb
        })
        return this;
    }

    onEventType(filter: string, cb: (val: any) => void) {
        this.handlers.push({
            type: 'onMessage',
            filter,
            func: cb
        })
        return this;
    }

}