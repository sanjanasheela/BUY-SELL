const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');  // adjust path if needed
const validateCartData = require('../middlewares/cartValidation');
const mongoose = require("mongoose");
// Get cart by userId (returns the entire cart document with items array)
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const cartEntries = await Cart.find({ userId });
// console.log(cartEntries);
    if (!cartEntries || cartEntries.length === 0) {
      return res.status(404).json({ message: 'No cart items found for this user.' });
    }

    const carts = cartEntries.map(entry => ({
      // sellerId: entry.sellerId,
      items: entry.items || []
    }));

    res.status(200).json({ userId, carts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cart items for the user.' });
  }
});



// Add or update item in cart
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
    console.log('validated cart');

    // Change from const to let here
    let cart = await Cart.findOne({ userId});

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId,
        
        items: [{
          sellerId,
          itemId,
          name,
          price,
          quantity: quantity || 1,
        }],
        createdAt: Date.now(),
      });
    }
    // console.log('addeddd');
     else {
     
      const existingItemIndex = cart.items.findIndex(
        (item) => item.itemId.toString() === itemId.toString()
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity || 1;
      } else {
        cart.items.push({
          sellerId,
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


  router.delete("/:userId/clear", async (req, res) => {
    const { userId } = req.params;
  
    console.log("Hit DELETE /cart/:userId/clear with userId:", userId);
  
    try {
      const buyerObjectId = new mongoose.Types.ObjectId(userId);
  
      // ❗ Use correct field: userId
      const carts = await Cart.find({ userId: buyerObjectId });
  
      if (!carts || carts.length === 0) {
        return res.status(404).json({ message: "No carts found for user" });
      }
  
      for (const cart of carts) {
        await cart.deleteOne(); // delete the whole cart document
      }
  
      res.status(200).json({ message: "Carts deleted successfully" });
    } catch (err) {
      console.error("Error clearing cart:", err);
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  });

module.exports = router;