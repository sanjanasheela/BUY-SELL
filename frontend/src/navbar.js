import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <nav style={{ padding: '1rem', background: '#eee', marginBottom: '1rem' }}>
       <Link to="/home" style={{ marginRight: '1rem' }}>Home</Link>
      <Link to="/searchitems" style={{ marginRight: '1rem' }}>Search</Link>
      {/* <Link to="/items" style={{ marginRight: '1rem' }}>Items</Link> */}
      <Link to="/ordershistory" style={{ marginRight: '1rem' }}>Order History</Link>
      <Link to="/deliveritems" style={{ marginRight: '1rem' }}>Delivery</Link>
      <Link to="/sell" style={{ marginRight: '1rem' }}>Sell</Link>
      <Link to="/mycart" style={{ marginRight: '1rem' }}>My Cart</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
