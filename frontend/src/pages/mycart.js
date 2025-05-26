import React, { useEffect, useState } from "react";
import Navbar from "../navbar";

function MyCart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  const user = JSON.parse(localStorage.getItem("userProfile"));
  const baseUrl = "http://localhost:8080/cart";

  useEffect(() => {
    if (user && user._id) {
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${baseUrl}/${user._id}`);
      if (!response.ok) throw new Error("Failed to fetch cart");
  
      const data = await response.json();
      console.log("Cart data:", data);
  
      // Combine all items from all sellers
      const mergedItems = data.carts.flatMap(cart => {
        return (cart.items || []).map(item => ({
          ...item,
          sellerId: cart.sellerId, // Ensure sellerId is included
        }));
      });
  
      setCartItems(mergedItems);
  
      const cost = mergedItems.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
      );
      setTotalCost(cost);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };
  

  const handleRemove = async (itemIdToRemove) => {
    try {
      console.log(user._id, itemIdToRemove);
      const response = await fetch(
        `${baseUrl}/${user._id}/remove/${itemIdToRemove}`,
        {
          method: "DELETE",
        }
      );
     

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove item");
      }

      const result = await response.json();
      console.log("Item removed:", result);

      // Update cartItems in frontend state
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.itemId !== itemIdToRemove)
      );

      // Recalculate total cost
      const newTotalCost = result.cart.items.reduce(
        (sum, item) => sum + item.price * (item.quantity || 1),
        0
      );
      setTotalCost(newTotalCost);
    } catch (error) {
      console.error("Error removing item from cart:", error.message);
      alert("Failed to remove item from cart.");
    }
  };

  const handleOrder = async () => {
    try {
      const response = await fetch(`${baseUrl}/${user._id}`, {
        method: "POST",
      });
      const result = await response.json();

      if (response.ok) {
        alert("Order placed successfully!");
        fetchCart();
      } else {
        alert(result.message || "Order failed!");
      }
    } catch (err) {
      alert("Something went wrong while placing the order.");
    }
  };
  const handleBuyNow = async (item) => {
    const orderData = {
      transactionId: `TXN-${Date.now()}`, // Unique transaction ID
      buyerId: user._id,
      sellerId: item.sellerId,  // Make sure `item` includes sellerId
      items: [
        {
          itemId: item.itemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity ?? 1
        }
      ],
      totalAmount: item.price * (item.quantity ?? 1),
      otpHash: "dummy_otp_hash_value"  // Replace with real OTP hash logic later
    };
  
    console.log('Sending order data:', orderData); // ✅ Print to check
  
    try {
      const response = await fetch(`http://localhost:8080/orderhis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to place order');
      }
  
      const result = await response.json();
      console.log('Order placed:', result);
      await handleRemove(item.itemId);

      alert('Item ordered successfully!');
    } catch (err) {
      console.error('Error ordering item:', err);
      alert('Failed to order item');
    }
  };
  
  

  if (!user) {
    return <p>Please log in to see your cart.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Navbar />
      <h2>My Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item._id || item.itemId || item.name}>
              <p>
                <strong>{item.name || "Unnamed Item"}</strong>
              </p>
              <p>
                ₹{item.price ?? "N/A"} (x{item.quantity ?? 1})
              </p>
              <button onClick={() => handleRemove(item.itemId)}>Remove</button>
              <button onClick={() => handleBuyNow(item)}>Buy Now</button> {/* NEW */}
            </div>
          ))}

          <hr />

          <p style={{ fontWeight: "bold", fontSize: "18px" }}>
            Total: ₹{totalCost}
          </p>

          <button onClick={handleOrder}>Place Final Order</button>
        </div>
      )}
    </div>
  );
}

export default MyCart;
