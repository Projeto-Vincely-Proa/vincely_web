import './footer.css';

import logo from "../../../assets/Logo1.png";

import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";


const Footer = () => {
    return (
        <footer className="footer">

            <div className="footer-top">
                <h2>Seu bem-estar importa.</h2>

                <a href="/cadastro">
                    <span>Cadastro</span> <IoIosArrowRoundForward className='arrow' />
                </a>
            </div>
            <div className="footer-bottom">

                <img src={logo} alt="logo Vincely" className="footer-logo" />

                <div className="socials">
                    <a href="https://github.com/Projeto-Vincely-Proa" aria-label="Github">
                        <FaGithub />
                    </a>
                    <a href="#" aria-label="Linkedin">
                        <FaLinkedin />
                    </a>

                    <a href="https://www.instagram.com/vincely_social/" aria-label="Instagram">
                        <FaInstagram />
                    </a>    
                </div>
            </div>
        </footer>




    );
};

export default Footer;