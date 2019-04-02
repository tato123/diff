import { WindowTool, ToolBuilder as ToolBuilderInterface } from './types';
import ToolBuilder from './toolbuilder'

export const build = (name: string): ToolBuilderInterface => {
    return new ToolBuilder(name);
}

export const expose = (tool: WindowTool, apiKey: string, initialState?: {}): void => {
    tool.init(apiKey, initialState)

    Object.assign(window, {
        [tool.name]: tool
    })
}