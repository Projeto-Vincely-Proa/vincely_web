import './landing.css';

import { IoIosArrowRoundForward } from "react-icons/io";

const Landing = () => {
    return (
        <section className="landing" id='landing'>
            <div className="container">
                <div className="landing-line"></div>
                <h2>Quando a Vida Pesar, Estamos Aqui</h2>

                <div className="landing-cards">
                    <p className='card'>
                        Seja a ansiedade que acelera seus pensamentos
                        ou a depressão que torna seus dias mais pesados,
                        você não precisa enfrentar isso sozinho.

                    </p>

                    <p className='card'>
                        Este é um espaço criado para acolher suas dores, oferecer apoio verdadeiro e mostrar que existe um caminho de esperança e transformação.
                    </p>

                    <p className='card'>
                        Aqui você encontra compreensão, recursos e pessoas dispostas a caminhar ao seu lado, porque cuidar da sua mente é também reencontrar sua força e redescobrir o sentido da vida.
                    </p>
                </div>

                <a href='/cadastro' className='link-btn'>
                    <span>Entrar na Comunidade</span> <IoIosArrowRoundForward className='arrow' />
                </a>
            </div>

        </section>
    );

};

export default Landing;