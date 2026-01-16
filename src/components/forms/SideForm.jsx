import './sideForm.css';
import ImgAmigo from './../../assets/img/forms/amigo.jpeg'

const SideForm = () => {
  return (
    <section className='side-form'>
          <img className='side-form__img' src={ImgAmigo} alt="imagem de uma amiga abraçando outra com um sorriso solidário" />
          
          <h2>Comece sua jornada</h2>
          
          <p className='side-form__description'>Você já teve a sensação de que precisa de ajuda emocional, mas não sabe por onde começar? Isso te parece familiar?.</p>
    </section>
  )
}

export default SideForm

