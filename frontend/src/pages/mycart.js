import React, { useEffect, useState } from 'react';
import Navbar from '../navbar';
// import './MyCart.css';

function MyCart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const user = JSON.parse(localStorage.getItem('userProfile'));
  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${baseUrl}/cart/${user._id}`);
      const data = await response.json();
      setCartItems(data.items);
      const cost = data.items.reduce((sum, item) => sum + item.price, 0);
      setTotalCost(cost);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await fetch(`${baseUrl}/cart/${user._id}/remove/${itemId}`, { method: 'DELETE' });
      fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const handleOrder = async () => {
    try {
      const response = await fetch(`${baseUrl}/cart/${user._id}/checkout`, {
        method: 'POST',
      });
      const result = await response.json();

      if (response.ok) {
        alert('Order placed successfully!');
        fetchCart();
      } else {
        alert(result.message || 'Order failed!');
      }
    } catch (err) {
      alert('Something went wrong while placing the order.');
    }
  };

  return (
    <div>
      <Navbar />
      <h2>My Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div className="cart-item" key={item._id}>
              <p><strong>{item.name}</strong> - ₹{item.price}</p>
              <button onClick={() => handleRemove(item._id)}>Remove</button>
            </div>
          ))}
          <hr />
          <p><strong>Total:</strong> ₹{totalCost}</p>
          <button className="order-btn" onClick={handleOrder}>Place Final Order</button>
        </div>
      )}
    </div>
  );
}

export default MyCart;
