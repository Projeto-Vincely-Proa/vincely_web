import './navbar.css'

import Logo from '../../../assets/Logo.png'
import { IoIosClose } from "react-icons/io";
import { IoIosMenu } from "react-icons/io";
import { useRef } from 'react';

const Navbar = () => {
  const navRef = useRef();

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  }

  return (
    <header className="navbar-container" id='navbar'>
      <div className="nav-logo-container">
        <h1>
          <img src={Logo} alt="Vincely" />
        </h1>
      </div>

      <nav className='navbar-links-container' ref={navRef}>
        <ul>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">Sobre</a>
          </li>
          <li>
            <a href="#testemonial">Depoimentos</a>
          </li>
        </ul>
        <button className='nav-btn close-nav-btn' onClick={showNavbar}>
          <IoIosClose />
        </button>
      </nav>
      <div className='navigation-btns'>
        <a href="/cadastro" className="primary-button">
          Cadastro <span className="arrow">→</span>
        </a>
        
        <button className='nav-btn' onClick={showNavbar}>
          <IoIosMenu />
        </button>
      </div>

    </header>
  )
}

export default Navbar
