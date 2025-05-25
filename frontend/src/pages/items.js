import React, { useEffect, useState } from "react";
import Navbar from "../navbar";

function ItemDetails() {
  const [item, setItem] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const savedItem = localStorage.getItem("selectedItem");
    if (savedItem) {
      setItem(JSON.parse(savedItem));
      localStorage.removeItem("selectedItem"); // Remove after use
    }
  }, []);

  const handleAddToCart = async () => {
    try {
      const userProfileString = localStorage.getItem("userProfile"); // get string from localStorage
      const userProfile = JSON.parse(userProfileString); // parse that string to object
      const userId = userProfile._id;
      console.log(userId);

        if (!userId) {
          alert("User not logged in.");
          return;
        }

        if (!item || !item._id) {
          alert("Item not loaded properly");
          return;
        }

        console.log("POST body being sent:", {
          userId: userId,
          itemId: item._id,
          quantity: 1,
        });

        const response = await fetch("http://localhost:8080/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId, // <-- Just the user ID string
            itemId: item._id.trim(), // <-- Item ID string
            quantity: 1,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to add to cart");
        }

        const data = await response.json();
        console.log("Cart item saved:", data);
        setAddedToCart(true);
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to add item to cart");
    }
  };

  if (!item) {
    return (
      <div>
        <Navbar />
        <p>Loading item details...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <h2>{item.itemname}</h2>
      <p>
        <strong>Price:</strong> ₹{item.price}
      </p>
      <p>
        <strong>Description:</strong> {item.description}
      </p>
      <p>
        <strong>Category:</strong>{" "}
        {Array.isArray(item.category)
          ? item.category.join(", ")
          : item.category}
      </p>
      <p>
        <strong>Seller ID:</strong> {item.sellerid}
      </p>

      <button
        onClick={handleAddToCart}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        Add to Cart
      </button>

      {addedToCart && (
        <p style={{ color: "green", marginTop: "10px" }}>Added to cart!</p>
      )}
    </div>
  );
}

export default ItemDetails;
