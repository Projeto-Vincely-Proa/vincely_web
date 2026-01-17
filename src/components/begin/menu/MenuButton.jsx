import { useContext } from 'react';
import { MenuContext } from './MenuHamburguer';
import { IoIosMenu } from "react-icons/io";

export function MenuButton() {
  const { toggle } = useContext(MenuContext)
  return <button
            className='navbar-menu-container'
            aria-label="Abrir Menu"
            aria-expanded="false"
            aria-controls="menu-principal"
            id="btn-menu"
            onClick={toggle}
            >
            <IoIosMenu className='menu-button' />
        </button>
}
