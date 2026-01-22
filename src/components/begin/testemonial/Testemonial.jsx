import './testemonial.css';

import Users1 from "../../../assets/Users1.png";
import Users2 from "../../../assets/users2.png";
import Users3 from "../../../assets/users3.png";


const Testemonial = () => {
    return (
        <section className="testemonial" id='testemonial'>

            <div className="testemonial-text">
                <h2>Depoimentos</h2>
                <span className="testemonial-line"></span>
                <p>
                    "Eu estava perdido entre a ansiedade e a tristeza.
                    Esta página me mostrou que existe esperança e que
                    pedir ajuda não é sinal de fraqueza, mas de força."
                </p>
            </div>

            <div className="testemonial-users">

                <div className="user">
                    <img src={Users1} alt="Ismarina Vieira" />
                    <div>
                        <p><strong>Ismaiara vieira</strong></p>

                        <p><span>Cliente</span></p>
                    </div>
                </div>


                <div className="user">
                    <img src={Users2} alt="foto de alvaro" />

                    <div>
                        <p><strong>Alvaro carvalho</strong></p>

                        <p><span>Cliente</span></p>
                    </div>
                </div>


                <div className="user">
                    <img src={Users3} alt="foto de alice" />

                    <div>
                        <p><strong>Alice caroline</strong></p>
                        <p><span>Cliente</span></p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testemonial;