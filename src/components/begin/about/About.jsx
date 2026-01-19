import './about.css';

import img1 from "../../../assets/img1.png";
import img2 from "../../../assets/img2.png";

import { IoIosArrowRoundForward } from "react-icons/io";

const About = () => {
  return (
    <section className="about" id="about">

      <div className="container">
        <img src={img2} alt="imagem de pessoas se abraçando" />

        <div className="about-line"></div>
        <div className="about-text">
          <h2>Você está em boas mãos</h2>

          <p>
            Quando a ansiedade parece tomar conta e os pensamentos não param,
            é difícil encontrar calma. Aqui você encontra um espaço pensado para
            ajudar a desacelerar, respirar fundo e descobrir formas de lidar com
            os desafios do dia a dia com mais leveza e segurança.
          </p>

          <a href='/cadastro' className='link-btn'>
            <span>Quero ajuda</span> <IoIosArrowRoundForward className='arrow' />
          </a>
        </div>

      </div>


      <div className="container reverse">
        <img src={img1} alt="imagem de pessoas dando as mãos em concordância" />

        <div className="about-line"></div>
        <div className="about-text">
          <h2>Você está em boas mãos</h2>

          <p>
            A depressão pode fazer parecer que a vida perdeu a cor
            e que cada passo é pesado demais. Mas você não precisa
            enfrentar isso sozinho. Este espaço foi criado para oferecer
            acolhimento, apoio e recursos que podem ajudar a iluminar o
            caminho e mostrar que existe esperança e novas possibilidades.
          </p>

          <a href='/cadastro' className='link-btn'>
            <span>Quero ajuda</span> <IoIosArrowRoundForward className='arrow' />
          </a>

        </div>
      </div>

    </section>
  );
};


export default About;
