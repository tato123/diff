import * as User from '../../aws/tables/Users';
import _ from 'lodash';

module.exports = {
    Origin: {
        async customerSubscription(parent, args, ctx, info) {
            if (_.isNil(parent.uid)) {
                return null;
            }

            //parent is the root object (User is the parent here)
            const user = await User.getUserByUid(parent.uid);
            return {
                plan: user.plan,
                status: user.status
            }
        }
    }

}