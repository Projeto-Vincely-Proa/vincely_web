import './form.css';

import Logo from '../../assets/Logo.png';
import SideForm from '../../components/forms/SideForm';
import InputForm from '../../components/forms/input/InputForm';

function Cadastro() {
  return (
    <>
      <title>Cadastro | Vincely</title>

      <main className='container-layout'>
        <div>
          <header className='header-form'>
            <h1><img src={Logo} alt="Vincely" /></h1>
          </header>

          <section className='container-form'>
            <h2>Cadastrar</h2>
            <p>Já tem uma conta? <a href="/login">Entre agora</a></p>

            <form action="/conteudo" method='get'>
              <InputForm 
                label="Nome Completo"
                type="text"
                name="name"
                id="name"
                placeholder="Ismaiara Carvalho de Oliveira"
              />

              <InputForm 
                label="Telefone"
                type="number"
                name="telefone"
                id="telefone"
                placeholder="192922001001"
              />

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

              <input type="submit" value="Entrar" />
            </form>
          </section>
        </div>

        <SideForm />

      </main>
    </>
  )
}

export default Cadastro