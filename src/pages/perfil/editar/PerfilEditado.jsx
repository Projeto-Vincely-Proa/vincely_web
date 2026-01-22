import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './perfilEditado.css';

import imgPerfil from '../../../img/user_profile.jpg';
import imgBanner from '../../../img/user_banner.png';

import SideBar from '../../../components/sidebar/sidebar';
import InputForm from '../../../components/forms/input/InputForm';
import SelectForm from '../../../components/forms/input/SelectForm';

const PerfilEditar = () => {
    const navigate = useNavigate();

    const [perfil, setPerfil] = useState({
        username: 'Alice Caroline',
        email: 'alice.caroline@gmail.com',
        phone: '11987654321',
        genero: 'Feminino',
        pronome: 'Ela/Dela',
        descricao: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setPerfil(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('perfilUsuario', JSON.stringify(perfil));
        navigate('/perfil');
    };

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

                        <div className="perfil-info__datas">
                            <p><strong>ID:</strong> @Lice274</p>
                            <p><strong>Pronome:</strong> Ela/Dela</p>
                        </div>
                    </header>

                    <section className='perfil-forms'>
                        <form onSubmit={handleSubmit}>
                            <div className='form-group form-primary'>
                                <InputForm
                                    label="Nome de usuário"
                                    type='text'
                                    id="username"
                                    name="username"
                                    value={perfil.username}
                                    onChange={handleChange}
                                />

                                <InputForm
                                    label="E-mail"
                                    type='email'
                                    id="email"
                                    value={perfil.email}
                                    disabled
                                />

                                <InputForm
                                    label="Telefone"
                                    type='text'
                                    id="phone"
                                    inputMode='numeric'
                                    value={perfil.phone}
                                    onChange={handleChange}
                                />

                                <InputForm
                                    label="Gênero"
                                    id="genero"
                                    value={perfil.genero}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="divide"></div>

                            <div className="form-groups form-primary">
                                <SelectForm 
                                    label="Pronomes"
                                    id="pronome"
                                    value=""
                                    onChange={handleChange}
                                    options={[
                                        {
                                            value: "Ele/Dele",
                                            label: "Ele/Dele"
                                        }, 
                                        {
                                            value: "Ela/Dela",
                                            label: "Ela/Dela"
                                        }, 
                                        {
                                            value: "Elu/Delu",
                                            label: "Elu/Delu"
                                        }, 
                                        {
                                            value: "Prefiro não dizer",
                                            label: "Prefiro não dizer"
                                        }
                                    ]}

                                />
                            </div>

                            <div className="perfil-description">
                                <label htmlFor="descricao">Descrição</label>
                                <textarea
                                    id="descricao"
                                    value={perfil.descricao}
                                    onChange={handleChange}
                                    placeholder="Como você está se sentindo?"
                                />
                            </div>

                            <div className='divide'></div>

                            <div className='btn-links'>
                                <a href="/perfil">Voltar</a>
                                <input className='btn-links__send' type="submit" value="Salvar" />
                            </div>
                        </form>
                    </section>
                </section>
            </main>
        </>
    );
};

export default PerfilEditar;
