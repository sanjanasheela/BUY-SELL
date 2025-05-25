import React, { useState, useEffect } from 'react';
import Navbar from '../navbar';
// import './DeliverItems.css';

function DeliverItems() {
  const [ordersToDeliver, setOrdersToDeliver] = useState([]);
  const [otpInputs, setOtpInputs] = useState({});
  const sellerId = JSON.parse(localStorage.getItem('userProfile'))._id;

  useEffect(() => {
    const fetchDeliverOrders = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
        const response = await fetch(`${baseUrl}/orders/toDeliver/${sellerId}`);
        const data = await response.json();
        setOrdersToDeliver(data.orders || []);
      } catch (error) {
        console.error('Failed to fetch orders to deliver:', error);
      }
    };

    fetchDeliverOrders();
  }, [sellerId]);

  const handleOtpChange = (orderId, value) => {
    setOtpInputs({ ...otpInputs, [orderId]: value });
  };

  const handleDeliver = async (orderId) => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';
      const enteredOtp = otpInputs[orderId];

      const response = await fetch(`${baseUrl}/orders/deliver/${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: enteredOtp })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Order marked as delivered!');
        setOrdersToDeliver(ordersToDeliver.filter(order => order._id !== orderId));
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (err) {
      alert('An error occurred while delivering the order.');
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Deliver Items</h2>
      {ordersToDeliver.length === 0 ? (
        <p>No items to deliver.</p>
      ) : (
        ordersToDeliver.map(order => (
          <div className="order-card" key={order._id}>
            <p><strong>Item:</strong> {order.itemName}</p>
            <p><strong>Price:</strong> ₹{order.price}</p>
            <p><strong>Buyer:</strong> {order.buyerName}</p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otpInputs[order._id] || ''}
              onChange={(e) => handleOtpChange(order._id, e.target.value)}
            />
            <button onClick={() => handleDeliver(order._id)}>Mark as Delivered</button>
          </div>
        ))
      )}
    </div>
  );
}

export default DeliverItems;
