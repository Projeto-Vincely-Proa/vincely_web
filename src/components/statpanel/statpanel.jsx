import "./statpanel.css";
import Stoncks from "../../icons/growth-up.svg";
import NoStoncks from "../../icons/down-growth.svg";

import Perfil01 from "../../img/profile/perfil01.svg";
import Perfil02 from "../../img/profile/perfil02.svg";
import Perfil03 from "../../img/profile/perfil03.svg";
import Perfil04 from "../../img/profile/perfil04.svg";
import Perfil05 from "../../img/profile/perfil05.svg";
import Perfil06 from "../../img/profile/perfil06.svg";
import Perfil07 from "../../img/profile/perfil07.svg";

function statpanel() {
    return (
        <aside className="est-members-panel">
            <div className="est-members-header">
                <h2>Membros</h2>
                <span className="est-total-members">235</span>
            </div>

            <section className="est-members-section">
                {/* Cada article representa um membro */}
                <article className="est-card-container">
                    <div className="est-card-info">
                        <img src={Perfil01} alt="Foto do membro" />
                        <div className="est-card-text">
                            <h3>Matheus Braga</h3>
                            <p>@Mattew1234</p>
                        </div>
                    </div>
                    <div className="est-card-footer">
                        <img src={Stoncks} alt="Ícone de progresso" />
                        <p><span>10.3%</span></p>
                    </div>
                </article>

                <article className="est-card-container">
                    <div className="est-card-info">
                        <img src={Perfil02} alt="Foto do membro" />
                        <div className="est-card-text">
                            <h3>Johnny</h3>
                            <p>@joh4</p>
                        </div>
                    </div>
                    <div className="est-card-footer">
                        <img src={Stoncks} alt="Ícone de progresso" />
                        <p><span>5.6%</span></p>
                    </div>
                </article>

                <article className="est-card-container">
                    <div className="est-card-info">
                        <img src={Perfil03} alt="Foto do membro" />
                        <div className="est-card-text">
                            <h3>Camili Fiasc</h3>
                            <p>@cah34</p>
                        </div>
                    </div>
                    <div className="est-card-footer">
                        <img src={NoStoncks} alt="Ícone de progresso" />
                        <p><span>2.2%</span></p>
                    </div>
                </article>

                <article className="est-card-container">
                    <div className="est-card-info">
                        <img src={Perfil04} alt="Foto do membro" />
                        <div className="est-card-text">
                            <h3>Ysmaiara</h3>
                            <p>@isis234</p>
                        </div>
                    </div>
                    <div className="est-card-footer">
                        <img src={Stoncks} alt="Ícone de progresso" />
                        <p><span>6.3%</span></p>
                    </div>
                </article>

                <article className="est-card-container">
                    <div className="est-card-info">
                        <img src={Perfil05} alt="Foto do membro" />
                        <div className="est-card-text">
                            <h3>Gustavo</h3>
                            <p>@olv1234</p>
                        </div>
                    </div>
                    <div className="est-card-footer">
                        <img src={NoStoncks} alt="Ícone de progresso" />
                        <p><span>4.9%</span></p>
                    </div>
                </article>

                <article className="est-card-container">
                    <div className="est-card-info">
                        <img src={Perfil06} alt="Foto do membro" />
                        <div className="est-card-text">
                            <h3>Jailson Prof</h3>
                            <p>@jaja234</p>
                        </div>
                    </div>
                    <div className="est-card-footer">
                        <img src={Stoncks} alt="Ícone de progresso" />
                        <p><span>2.1%</span></p>
                    </div>
                </article>

                <article className="est-card-container">
                    <div className="est-card-info">
                        <img src={Perfil07} alt="Foto do membro" />
                        <div className="est-card-text">
                            <h3>Nina Maria</h3>
                            <p>@ashking1234</p>
                        </div>
                    </div>
                    <div className="est-card-footer">
                        <img src={Stoncks} alt="Ícone de progresso" />
                        <p><span>8.6%</span></p>
                    </div>
                </article>
            </section>
        </aside>
    );
}

export default statpanel;
