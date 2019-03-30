import * as Deltas from '../../aws/tables/Deltas'

interface DeltaArgs {
    Host: string;
}

const deltasQuery = async (_parent, args: DeltaArgs) => {
    if (!args.Host) {
        return {}
    }

    return await Deltas.getDelta(args.Host)
};

export default deltasQuery;