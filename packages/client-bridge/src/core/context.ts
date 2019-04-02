import { ToolBuilder, Middleware, CommandBuilder, WindowTool, Context, WindowTools } from './types';
import { observable, toJS, autorun, set, reaction, get, observe, action, runInAction } from 'mobx';



export default class ContextImpl implements Context {
    state = observable({
        records: []
    })


    replaceState = (state: any) => {
        set(this.state, state);


    }
}