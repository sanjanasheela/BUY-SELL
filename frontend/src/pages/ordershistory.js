import React, { useEffect, useState } from 'react';
import Navbar from '../navbar';
// import './OrdersHistory.css';

function OrdersHistory() {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingOrders, setPendingOrders] = useState([]);
  const [boughtItems, setBoughtItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);

  const userId = JSON.parse(localStorage.getItem('userProfile'))._id;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

        const [pendingRes, boughtRes, soldRes] = await Promise.all([
          fetch(`${baseUrl}/orders/pending/${userId}`),
          fetch(`${baseUrl}/orders/bought/${userId}`),
          fetch(`${baseUrl}/orders/sold/${userId}`)
        ]);

        const [pendingData, boughtData, soldData] = await Promise.all([
          pendingRes.json(),
          boughtRes.json(),
          soldRes.json()
        ]);

        setPendingOrders(pendingData.orders || []);
        setBoughtItems(boughtData.items || []);
        setSoldItems(soldData.items || []);
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchOrders();
  }, [userId]);

  const renderTabContent = () => {
    if (activeTab === 'pending') {
      return (
        <div className="order-section">
          {pendingOrders.length === 0 ? <p>No pending orders.</p> :
            pendingOrders.map(order => (
              <div key={order._id} className="order-card">
                <p><strong>Item:</strong> {order.itemName}</p>
                <p><strong>Seller:</strong> {order.sellerName}</p>
                <p><strong>Price:</strong> ₹{order.price}</p>
                <p><strong>OTP:</strong> {order.otp}</p>
              </div>
            ))
          }
        </div>
      );
    } else if (activeTab === 'bought') {
      return (
        <div className="order-section">
          {boughtItems.length === 0 ? <p>No items bought.</p> :
            boughtItems.map(item => (
              <div key={item._id} className="order-card">
                <p><strong>Item:</strong> {item.name}</p>
                <p><strong>Price:</strong> ₹{item.price}</p>
                <p><strong>Seller:</strong> {item.sellerName}</p>
              </div>
            ))
          }
        </div>
      );
    } else if (activeTab === 'sold') {
      return (
        <div className="order-section">
          {soldItems.length === 0 ? <p>No items sold.</p> :
            soldItems.map(item => (
              <div key={item._id} className="order-card">
                <p><strong>Item:</strong> {item.name}</p>
                <p><strong>Price:</strong> ₹{item.price}</p>
                <p><strong>Buyer:</strong> {item.buyerName}</p>
              </div>
            ))
          }
        </div>
      );
    }
  };

  return (
    <div>
      <Navbar />
      <h2>Order History</h2>

      <div className="tabs">
        <button onClick={() => setActiveTab('pending')} className={activeTab === 'pending' ? 'active' : ''}>Pending Orders</button>
        <button onClick={() => setActiveTab('bought')} className={activeTab === 'bought' ? 'active' : ''}>Items Bought</button>
        <button onClick={() => setActiveTab('sold')} className={activeTab === 'sold' ? 'active' : ''}>Items Sold</button>
      </div>

      {renderTabContent()}
    </div>
  );
}

export default OrdersHistory;
