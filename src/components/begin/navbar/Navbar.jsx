import React from "react";
import Logo from "../../../assets/Logo.png"
import './navbar.css';


const Navbar = () => {
  return (
    <nav className="begin-navbar">
      <div className="nav-logo-container">
        <h1>
          <img src={Logo} alt="logo vincely" />
        </h1>
      </div>
      
      <div className="navbar-links-container">
        <a href="#home">Home</a>
        <a href="#about">Sobre</a>
        <a href="#testemonial">Avaliação</a>



        <button className="primary-button">
          Cadastro<span className="arrow">→</span>
        </button>
      </div>
    </nav>

  );

};
export default Navbar;