
import { build, expose } from './core';
import { action, autorun, runInAction } from 'mobx';


// Commands are things that we can do, actively modify
// the page in some way or provide some way of interacting in diff
import AddPagelet from './commands/AddPagelet';
import Designer from './commands/Designer';

// Handlers are reactive, they consume infomration about the 
// context and allow us to perform operations
import Handler from './handlers/InlineStyle';
import StyleSheet from './handlers/StyleSheet';

// Event Type handlers
import Handshake, { type as HandshakeType } from './events/handshake';

// Our product configuration
import config from './config.json';

let diff = build('diff')
    // Handlers respond to record types
    .onRecordType('stylesheet', StyleSheet)
    .onRecordType('inline-style', Handler)

    // Event Types
    .onEventType(HandshakeType, Handshake)

    // contruct the commands that can be performed by diff
    .command('addPagelet', AddPagelet)
    .command('designer', Designer)
    .create();

expose(diff, config['_API_KEY_'], config['_INITIAL_STATE_'])