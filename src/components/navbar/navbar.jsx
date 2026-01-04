import React from "react";
import "./navbar.css";
import Search from "../../icons/bx-search.svg";
import Add from "../../icons/Icon_Mais.svg";
import Bell from "../../icons/Vector.svg";

function Navbar() {
    return (
        <nav className="navbar">
            <h1 className="navbar-title">Minhas Comunidades</h1>

            <div className="navbar-content-right">
                <div className="input-search">
                    <img src={Search} alt="Pesquisar" />
                    <input type="text" placeholder="Search" />
                </div>

                <button className="btn-add">
                    <img src={Add} alt="Adicionar" />
                </button>

                <button className="btn-bell">
                    <img src={Bell} alt="Notificações" />
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
