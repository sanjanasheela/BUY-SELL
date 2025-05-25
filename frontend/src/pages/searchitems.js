import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";

function SearchItems() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();

  // Extract unique categories from items
  const allCategories = Array.from(
    new Set(
      items.flatMap((item) =>
        Array.isArray(item.category) ? item.category : [item.category]
      )
    )
  );

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:8080/sell/list");
        const data = await res.json();
        setItems(data);
        setFilteredItems(data); // Show all items initially
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    fetchItems();
  }, []);

  // Filter items automatically whenever search term or selected categories change
  useEffect(() => {
    const filtered = items.filter((item) => {
      const nameMatch = item.itemname
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const categories = Array.isArray(item.category)
        ? item.category
        : [item.category];
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.some((cat) => categories.includes(cat));

      return nameMatch && categoryMatch;
    });

    setFilteredItems(filtered);
  }, [searchTerm, selectedCategories, items]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    );
  };

  return (
    <div>
      <Navbar />
      <h2>All Items</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Left side: Search bar and items */}
        <div style={{ flex: 3 }}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Search items by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: "8px", width: "300px" }}
            />
          </div>

          <div className="items-grid">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="item-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    localStorage.setItem("selectedItem", JSON.stringify(item)); // Store item data
                    navigate(`/item/${item._id}`); // Navigate to details page
                  }}
                >
                  <h4>{item.itemname}</h4>
                  <p>Price: ₹{item.price}</p>
                  <p>Description: {item.description}</p>
                  <p>
                    Category:{" "}
                    {Array.isArray(item.category)
                      ? item.category.join(", ")
                      : item.category}
                  </p>
                  <p>Seller ID: {item.sellerid}</p>
                </div>
              ))
            ) : (
              <p>No items found.</p>
            )}
          </div>
        </div>

        {/* Right side: Category filters */}
        <div>
          <h3>Filter by Category</h3>
          {allCategories.map((category) => (
            <div key={category} style={{ marginBottom: "8px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                {" " + category}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchItems;
