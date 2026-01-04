import AddMember from "../../icons/add_account.svg";
import RemoveMember from "../../icons/account_info.svg";
import ComunidadeIcon from "../../icons/circle_layer.svg";
import "./communitymembers.css";

function communitymembers() {
    return (
        <aside className="community-panel">
            <section className="community-stats">
                <h2>Sobre Comunidade</h2>

                <article className="community-card">
                    <div className="card-content">
                        <div className="card-text">
                            <h3>51</h3>
                            <p>Total de comunidades</p>
                        </div>
                        <button className="card-button" aria-label="Total de comunidades">
                            <img src={ComunidadeIcon} alt="Ícone de comunidade" />
                        </button>
                    </div>
                </article>

                <article className="community-card">
                    <div className="card-content">
                        <div className="card-text">
                            <h3>49</h3>
                            <p>Adicionados recentemente</p>
                        </div>
                        <button className="card-button" aria-label="Membros adicionados recentemente">
                            <img src={AddMember} alt="Ícone de adicionar membros" />
                        </button>
                    </div>
                </article>

                <article className="community-card">
                    <div className="card-content">
                        <div className="card-text">
                            <h3>09</h3>
                            <p>Membros antigos saíram</p>
                        </div>
                        <button className="card-button" aria-label="Membros que saíram">
                            <img src={RemoveMember} alt="Ícone de remover membros" />
                        </button>
                    </div>
                </article>
            </section>
        </aside>
    );
}

export default communitymembers;
