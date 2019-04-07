import { CommandBuilder, Context, CommandOptions } from '../core/types';

type Inner = { [records: string]: any[] };

const Designer: CommandBuilder = ({ ctx, win }: CommandOptions) => () => {
    import('../designer/App').then(() => {
        console.log('loaded designer');
        document.body.insertAdjacentHTML('beforeend', '<my-component />')
    })
}


export default Designer;