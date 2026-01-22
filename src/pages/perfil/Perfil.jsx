import './perfil.css';
import imgPerfil from '../../img/user_profile.jpg';
import imgBanner from '../../img/user_banner.png';
import SideBar from '../../components/sidebar/sidebar';

const Perfil = () => {
    let perfil = JSON.parse(localStorage.getItem('perfilUsuario'));

    if (!perfil) {
        perfil = {
            username: 'Alice Caroline',
            email: 'alice.caroline@gmail.com',
            phone: '11987654321',
            genero: 'Feminino',
            pronome: 'Ela/Dela',
            descricao: ''
        };

    }

    return (
        <>
            <title>
                Perfil | Vincely
            </title>

            <SideBar />

            <main className="perfil">
                <section className="perfil-container">

                    <header className="perfil-info">
                        <div className="perfil-info__images">
                            <div className="perfil-banner">
                                <img
                                    src={imgBanner}
                                    alt="Banner do perfil do usuário"
                                />
                            </div>
                            <div className="perfil-avatar">
                                <img
                                    src={imgPerfil}
                                    alt="Foto de perfil do usuário"
                                />
                            </div>
                        </div>

                        <div className="perfil-identidade">
                            <h2>{perfil.username}</h2>
                            <div className="perfil-identidade__abaixo">
                                <p><strong>Gênero: </strong>{perfil.genero}</p>
                                <p><strong>Pronomes: </strong>{perfil.pronome}</p>
                            </div>
                        </div>
                    </header>

                    <section className="perfil-card">
                        <h3>Sobre</h3>

                        {perfil.descricao ? (
                            <p className="perfil-sobre">
                                {perfil.descricao}
                            </p>
                        ) : (
                            <p className="perfil-sobre perfil-vazio">
                                Este usuário ainda não escreveu uma descrição.
                            </p>
                        )}
                    </section>

                    {/* ===== INFORMAÇÕES ===== */}
                    <section className="perfil-card">
                        <h3>Informações</h3>

                        <div className="perfil-info-list">
                            <div>
                                <span>E-mail</span>
                                <p>{perfil.email}</p>
                            </div>

                            <div>
                                <span>Telefone</span>
                                <p>{perfil.phone}</p>
                            </div>
                        </div>
                    </section>

                    {/* ===== AÇÕES ===== */}
                    <div className="perfil-acoes">
                        <a href="/perfil/editar">Editar perfil</a>
                    </div>

                </section>
            </main>
        </>
    );
};

export default Perfil;
