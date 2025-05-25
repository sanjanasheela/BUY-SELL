const express = require('express');
const router = express.Router();
const { listAllTheOrders } = require('../controller/orderhisController');

router.get('/', listAllTheOrders);

module.exports = router;