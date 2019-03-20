

/**
 * We need to rely on our testing suite to handle these
 */
export default ({ express }) => {
    // we can 
    express.get('/auth0/hook/register', async (req, res) => {
        console.log('an auth0 register hook was called', req);
        res.status(201).send();
    })


    // do something else
    express.get('/auth0/hook/user', async (req, res) => {
        console.log('an auth0 user hook was called', req);
        res.status(201).send();
    })
}



