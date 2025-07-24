import React from 'react';
// import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <h2>Untern</h2>
        </div>
        <ul className="nav-menu">
          <li className="nav-item">
            <a href="" className="nav-link">Home</a>
          </li>
          <li className="nav-item">
            <a href="#students" className="nav-link">For Students</a>
          </li>
          <li className="nav-item">
            <a href="#companies" className="nav-link">For Companies</a>
          </li>
          <li className="nav-item">
            <a href="#faq" className="nav-link">FAQ</a>
          </li>
          <li className="nav-item">
            <a href="#blog" className="nav-link">Blog</a>
          </li>
          <li className="nav-item">
            <a href="#about" className="nav-link">About</a>
          </li>
        </ul>
        <button className="get-started-btn">Get Started</button>
      </div>
    </nav>
  );
};

export default Navbar;