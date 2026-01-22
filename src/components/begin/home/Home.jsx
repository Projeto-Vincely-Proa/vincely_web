
import './home.css';

import Navbar from "../navbar/Navbar";


const Home = () => {

       return (
              <div className='home-background'>
                     <header>
                            <Navbar />
                     </header>

                     <section className="home" id='home'>
                            <div className="text-section">
                                   <h2 className="primary-heading">Um espaço seguro para cuidar da sua mente e encontrar apoio de verdade.</h2>
                                   <div className='primary-text'>
                                          <p>
                                                 Se você convive com momentos de ansiedade ou enfrenta
                                                 a tristeza da depressão, saiba que não está sozinho.
                                          </p>
                                          <p>
                                                 Este é um espaço seguro, feito para acolher suas emoções
                                                 e oferecer caminhos de apoio, compreensão e esperança
                                                 para que você possa cuidar da sua mente e reencontrar
                                                 o equilíbrio.
                                          </p>
                                   </div>

                            </div>
                     </section>
              </div>


       );
};
export default Home;