import './footer.css';
import logo from "../../../assets/Logo1.png";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";



const Footer = () => {
    return (
        <>
            <footer className="footer">
                <div className="footer-container">

                    <div className="footer-top">
                        <h2>Seu bem-estar importa.</h2>

                        <a href="#cadastro" className="primary-button">
                            Cadastro<span className="arrow">→</span>
                        </a>
                    </div>
                    <div className="footer-bottom">

                        <div className="footer-brand">
                            <img src={logo} alt="logo Vincely" className="footer-logo" />

                            <div className="socials">
                                <a href="#" aria-label="Facebook">
                                    <FaFacebookF />
                                </a>
                                <a href="#" aria-label="Twitter">
                                    <FaTwitter />
                                </a>

                                <a href="#" aria-label="Instagram">
                                    <FaInstagram />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>





            </footer>




        </>




    );
};

export default Footer;