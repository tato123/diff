import * as Users from '../aws/tables/Users'

/**
 * We need to rely on our testing suite to handle these
 */
export default ({ express }) => {
    // we can 
    express.get('/auth0/hook/register', async (req, res) => {
        console.log('an auth0 register hook was called', req.body);
        const uid = req.body.user_id || req.body.sub;
        try {
            await Users.createUid(uid);
            res.status(201).json(req.body);
        } catch (err) {
            res.status(400).send('unable to register user')
        }

    })


    // do something else
    express.get('/auth0/hook/user', (req, res) => {
        console.log('an auth0 user hook was called', req);
        res.status(201).send();
    })
}



