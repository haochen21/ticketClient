const routes = require('express').Router();
const portalAuth = require('./wx-portalAuth');
const customer = require('./wx-customer');
const merchant = require('./wx-merchant');
routes.use('/portalAuth', portalAuth);
routes.use('/customer', customer);
routes.use('/merchant', merchant);

module.exports = routes;