import './form.css';

import Logo from '../../assets/Logo.png';
import SideForm from '../../components/forms/SideForm';
import InputForm from '../../components/forms/input/InputForm';

import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from "react-icons/fa6";

function Login() {
  return (
    <>
      <title>Login | Vincely</title>

      <main className='container-layout'>
        <div>
          <header className='header-form'>
            <h1><img src={Logo} alt="Vincely" /></h1>
          </header>

          <section className='container-form'>
            <h2>Login</h2>

            <form action="/conteudo" method='get'>
              <InputForm
                label="E-mail"
                type="email"
                name="email"
                id="email"
                placeholder="exemplo@gmail.com"

              />

              <InputForm
                label="Senha"
                type="password"
                name="pwd"
                id="pwd"
                placeholder="@#*%"
              />

              <div className='form-config'>
                <div className='form-config__checkbox'>
                  <input type="checkbox" name="remember" id="remember" />
                  <label htmlFor="remember">Lembrar-me</label>
                </div>

                <a href="/login">Esqueceu sua senha?</a>
              </div>

              <input type="submit" value="Entrar" />
            </form>

            <p className='another-form'>Não tem uma conta? <a href="/cadastro">Crie uma agora</a></p>


            <div className="divider">

              <span>OU</span>
            </div>

            <div className="btn-icons">
              <button>
                <FcGoogle className='icons' />
                <span className='btn-icons__text'>
                  Continue com Google
                </span>
              </button>

              <button>
                <FaFacebook className='icons' />
                <span className='btn-icons__text'>
                  Continue com Facebook
                </span>
              </button>
            </div>
          </section>
        </div>

        <SideForm />

      </main>
    </>
  )
}

export default Login