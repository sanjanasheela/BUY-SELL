const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');  // adjust path if needed
const validateCartData = require('../middlewares/cartValidation');

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
  
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
  
    try {
      const cartItems = await Cart.find({ userId }).populate('itemId');
  
      if (cartItems.length === 0) {
        return res.status(404).json({ message: 'No items found in cart for this user' });
      }
  
      res.status(200).json(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

router.post('/', async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;
   
    // Validate data\
    console.log(userId);
    console.log(itemId);
    console.log(quantity);

    const { isValid, errors } = validateCartData({ userId, itemId, quantity });
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    console.log('hi');
    // Check if this item already exists in user's cart
    let cartItem = await Cart.findOne({ userId, itemId });

    if (cartItem) {
      // Update quantity
      cartItem.quantity += quantity || 1;
    } else {
      // Create new cart item
      cartItem = new Cart({
        userId,
        itemId,
        quantity: quantity || 1,
        createdAt: Date.now()
      });
    }

    await cartItem.save();
    console.log('doneeee');
    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Error saving cart item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
