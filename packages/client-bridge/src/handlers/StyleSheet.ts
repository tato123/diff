
import { PageMutationHandler, MutationRecord, PageMutationOptions } from '../core/types';


const Handler: PageMutationHandler = (mutation: MutationRecord, { win }: PageMutationOptions) => {

    win.ready(() => {
        const body = document.querySelector('body');
        if (body != null && !!mutation.value) {
            body.insertAdjacentHTML('beforeend', `<style type="text/css" data-vendor="diff">${mutation.value}</style>`)
        }
    })
}

export default Handler;