import React from 'react'

function Login() {
  return (
    <>      
      <title>Login | Vincely</title>

      <main>
        {/* Logo da Página */}
        <h1>Logo</h1>
        <section>
          <h2>Login</h2>
          <p>Não tem uma conta? <a href="#">Crie uma agora</a></p>

          <form action="#" method='post'>
            <label htmlFor="email">E-mail</label>
            <input type="email" name="email" id="email" placeholder='exemplo@gmail.com'/>

            <label htmlFor="pwd">Senha</label>
            <input type="password" name="pwd" id="pwd" placeholder='@#*%'/>

            <div>
              <input type="checkbox" name="remember" id="remember"/>
              <label htmlFor="remember">Lembrar-me</label>

              <a href="#">Esqueceu sua senha?</a>
            </div>

            <input type="submit" value="Entrar" />
          </form>

          <hr />

          <button>Continue com o Google</button>
          <button>Continue com o Facebook</button>
        </section>
        <section>
          <p>Suporte</p>
          <img src="#" alt="imagem de uma amiga abraçando outra com um sorriso solidário" />
          <h2>Comece sua jornada</h2>
          <p>Você já teve a sensação de que precisa de ajuda emocional, mas não sabe por onde começar? Isso te parece familiar?.</p>
        </section>
      </main>
    </>
  )
}

export default Login