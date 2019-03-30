import stripe from './stripe';
import auth from './auth';

export default (server) => {
    stripe(server);
    auth(server);
}