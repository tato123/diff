import startWatchMutation from './mutations';
import startMessageClient from './messageClient';




if (window.delta ) {
    window.applyChanges(window.delta)
}


startWatchMutation();
startMessageClient();