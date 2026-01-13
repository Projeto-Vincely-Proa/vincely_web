import './landing.css';


const Landing = () => {
    return (
        <>
            <section className="landing-section-containe" id='landing'>
                <div className="landing-text-section-containe">
                    <div className="landing-line"></div>
                    <h2 className="third-heading">Você está em boas mãos</h2>

                    <p className="third-text">
                        Seja a ansiedade que acelera seus pensamentos
                        ou a depressão que torna seus dias mais pesados,
                        você não precisa enfrentar isso sozinho. Este é
                        um espaço criado para acolher suas dores, oferecer
                        apoio verdadeiro e mostrar que existe um caminho de
                        esperança e transformação. Aqui você encontra compreensão,
                        recursos e pessoas dispostas a caminhar ao seu lado, porque
                        cuidar da sua mente é também reencontrar sua força e redescobrir
                        o sentido da vida.
                    </p>

                    <button className="third-button">
                        Quero ajuda <span className="arrow">→</span>
                    </button>
                </div>

            </section>




        </>

    );

};

export default Landing;