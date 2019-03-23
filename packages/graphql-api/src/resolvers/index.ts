import Subscription from './Subscription'

const Query = require('./Query');
const Mutation = require('./Mutation');
const Model = require('./Model')


module.exports = Object.assign({
    Query, Mutation, Subscription
}, Model)