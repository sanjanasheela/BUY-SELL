const express = require('express');
const sellItemValidation = require('../middlewares/sellAuth');
const router = express.Router();
const { allItems }  = require('../controller/sellcontroller')
const { sellItem } = require('../controller/sellcontroller'); // correct named import
const ItemModel = require('../models/cart'); 
const mongoose = require('mongoose');

router.post('/', sellItemValidation, sellItem);
router.get('/list',allItems);
// const mongoose = require('mongoose');

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log("Trying to delete item with ID:", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log('Invalid ID format');
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const item = await ItemModel.findById(id);  // ✅ Works because id is casted to ObjectId
    if (!item) {
      console.log('Item not found');
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.deleteOne();  // or ItemModel.deleteOne({ _id: id })
    res.status(200).json({ message: 'Item deleted successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
});

  
  
module.exports = router;
