
import _ from 'lodash';
import * as Users from '../../aws/tables/Users';


export const subscription = async (_parent: any, args: any, context) => {
    const user = await context.getUser();

    // by default limit it
    const limit = _.get(args, 'limit.mine', false);


    try {
        const result = await Users.getUserByUid(user.sub);
        console.log('subscription result is', result);
        return result;
    } catch (err) {
        console.error('Error when looking up subscription for', user.sub, err.message)
        return null;
    }


}