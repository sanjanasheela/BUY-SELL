const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');  // adjust path if needed
const validateCartData = require('../middlewares/cartValidation');

// Get cart by userId (returns the entire cart document with items array)
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const cartEntries = await Cart.find({ userId });

    if (!cartEntries || cartEntries.length === 0) {
      return res.status(404).json({ message: 'No cart items found for this user.' });
    }

    const carts = cartEntries.map(entry => ({
      sellerId: entry.sellerId,
      items: entry.items || []
    }));

    res.status(200).json({ userId, carts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cart items for the user.' });
  }
});



// Add or update item in cart
router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const { userId, sellerId, itemId, quantity, name, price } = req.body;

    // Validate input
    const { isValid, errors } = validateCartData({ userId, sellerId, itemId, quantity, name, price });
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    // ✅ Important: Find cart by both userId and sellerId
    let cart = await Cart.findOne({ userId, sellerId });

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId,
        sellerId,
        items: [{
          itemId,
          name,
          price,
          quantity: quantity || 1,
        }],
        createdAt: Date.now(),
      });
    } else {
      // Update existing cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.itemId.toString() === itemId.toString()
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity || 1;
      } else {
        cart.items.push({
          itemId,
          name,
          price,
          quantity: quantity || 1,
        });
      }
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    console.error('Error saving cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Remove item from cart
router.delete('/:userId/remove/:itemId', async (req, res) => {
  try {
    console.log('got the request');
    const { userId, itemId } = req.params;
    console.log(userId,itemId);

    // Find the cart for the user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user.' });
    }

    // Filter out the item to remove
    const originalItemCount = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.itemId.toString() !== itemId.toString()
    );

    if (cart.items.length === originalItemCount) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    await cart.save();

    res.status(200).json({
      message: 'Item removed from cart successfully.',
      cart,
    });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Optional: Checkout route to clear cart or place order (depends on your business logic)
router.post('/:userId/checkout', async (req, res) => {
  try {
    
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found' });
    }

    // TODO: Process order logic here (payment, order creation, etc.)

    // After order placed, clear cart
    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Order placed successfully!' });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
