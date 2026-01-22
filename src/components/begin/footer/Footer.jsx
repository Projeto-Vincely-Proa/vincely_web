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

                <a href="#navbar">
                    <img src={logo} alt="logo Vincely" className="footer-logo" />
                </a>

                <div className="socials">
                    <a 
                    href="https://github.com/Projeto-Vincely-Proa" 
                    target='_blank' 
                    rel="noopener noreferrer" 
                    aria-label="Github"
                    >
                        <FaGithub />
                    </a>
                    <a 
                    href="https://www.linkedin.com/in/vincely-social-1275903a4/" 
                    target='_blank' 
                    rel="noopener noreferrer" 
                    aria-label="Linkedin"
                    >
                        <FaLinkedin />
                    </a>

                    <a 
                    href="https://www.instagram.com/vincely_social/" 
                    target='_blank' 
                    rel="noopener noreferrer" 
                    aria-label="Instagram"
                    >
                        <FaInstagram />
                    </a>
                </div>
            </div>
        </footer>




    );
};

export default Footer;