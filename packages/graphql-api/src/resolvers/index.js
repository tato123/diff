const Query = require('./Query');
const Mutation = require('./Mutation');
const Subscription = require('./Subscription');
const Model = require('./Model')



module.exports = Object.assign({
    Query, Mutation, Subscription
}, Model)