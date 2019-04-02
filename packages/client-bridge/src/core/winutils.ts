import { WindowTools } from './types';
// @ts-ignore
import ready from '@ryanmorr/ready';


const winUtils: WindowTools = {
    getWidth() {
        return 10
    },
    observeElements(selector: string, cb: any) {
        ready(selector, cb);
    },
    ready(cb: EventListener | EventListenerObject) {
        window.addEventListener('DOMContentLoaded', cb);
    }
}


export default winUtils;