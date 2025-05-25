const express = require('express');
const sellItemValidation = require('../middlewares/sellAuth');
const router = express.Router();
const { allItems }  = require('../controller/sellcontroller')
const { sellItem } = require('../controller/sellcontroller'); // correct named import

router.post('/', sellItemValidation, sellItem);
router.get('/list',allItems);
module.exports = router;
