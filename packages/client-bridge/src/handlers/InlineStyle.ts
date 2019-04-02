
import { PageMutationHandler, MutationRecord, PageMutationOptions } from '../core/types';


const Handler: PageMutationHandler = (mutation: MutationRecord, { win }: PageMutationOptions) => {
    win.observeElements(mutation.selector, (element: HTMLElement) => {
        if (mutation.value !== undefined) {
            element.setAttribute('style', mutation.value)
        }
    })

}

export default Handler;