import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            backgroundColor: '#1e3a8a', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginRight: '15px'
          }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>S</span>
          </div>
          <h1 style={{ margin: 0, color: '#1e3a8a' }}>SecureBank</h1>
        </div>
        <div>
          <Link to="/">대시보드</Link>
          <Link to="/users">고객 관리</Link>
          <Link to="/posts">거래 내역</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

