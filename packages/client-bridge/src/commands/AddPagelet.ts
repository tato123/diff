import { CommandBuilder, Context, CommandOptions } from '../core/types';
import { action, autorun, runInAction } from 'mobx';

type Inner = { [records: string]: any[] };

const AddPagelet: CommandBuilder = ({ ctx, win }: CommandOptions) => () => {

    runInAction(() => {
        const records = ctx.state.records;

        records.push({
            type: 'inline-style',
            selector: 'p',
            style: `color:red; font-size: 64px;`
        })

    })




}


export default AddPagelet;