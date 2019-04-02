
import { build, expose } from './core';

// Commands are things that we can do, actively modify
// the page in some way or provide some way of interacting in diff
import AddPagelet from './commands/AddPagelet';

// Handlers are reactive, they consume infomration about the 
// context and allow us to perform operations
import Handler from './handlers/InlineStyle';
import StyleSheet from './handlers/StyleSheet';

// Our product configuration
import config from './config.json';

let diff = build('diff')
    // Handlers respond to record types
    .onRecordType('stylesheet', StyleSheet)
    .onRecordType('inline-style', Handler)

    //
    .onEventType('test', (val: any) => {
        console.log('hello world');
    })

    // contruct the commands that can be performed by diff
    .command('addPagelet', AddPagelet)
    .create();

expose(diff, config['_API_KEY_'], config['_INITIAL_STATE_'])