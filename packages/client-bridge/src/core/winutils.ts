import { WindowTools } from './types';
// @ts-ignore
import ready from '@ryanmorr/ready';


let loaded = false;

const winUtils: WindowTools = {
    getWidth() {
        return 10
    },
    observeElements(selector: string, cb: any) {
        ready(selector, cb);
    },
    ready(cb: () => void) {
        if (loaded) {
            cb();
        }

        window.addEventListener('DOMContentLoaded', () => {
            loaded = true;
            cb();
        });
    }
}


export default winUtils;