import './navbar.css'
import Logo from '../../../assets/Logo.png'
import {
  MenuHamburguer,
  MenuButton,
  MenuContent
} from '../menu';
import { IoIosClose } from "react-icons/io";

const Navbar = () => {
  return (
    <header className="navbar-container">
      <div className="nav-logo-container">
        <h1>
          <img src={Logo} alt="Vincely" />
        </h1>
      </div>

      <MenuHamburguer>
        <MenuButton />
        <MenuContent>
          <nav className="navbar-links-container">
            <button><IoIosClose className='close-btn' /></button>
            <ul className='menu'>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">Sobre</a></li>
              <li><a href="#testemonial">Avaliação</a></li>
            </ul>

            <a href="/cadastro" className="primary-button">
              Cadastro <span className="arrow">→</span>
            </a>
          </nav>
        </MenuContent>
      </MenuHamburguer>
    </header>
  )
}

export default Navbar
