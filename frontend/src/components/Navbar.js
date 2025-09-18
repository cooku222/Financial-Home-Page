import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <h1>Web Server Project</h1>
        <div>
          <Link to="/">홈</Link>
          <Link to="/users">사용자</Link>
          <Link to="/posts">게시글</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

