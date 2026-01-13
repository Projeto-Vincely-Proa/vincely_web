import './sideForm.css';
import ImgAmigo from './../../assets/img/forms/amigo.jpeg'
import { MdOutlineSupportAgent } from "react-icons/md";

const SideForm = () => {
  return (
    <section className='side-form'>
          <p className="side-form__tag">
            <MdOutlineSupportAgent className='side-form__icon'/>
            Suporte
          </p>

          <img className='side-form__img' src={ImgAmigo} alt="imagem de uma amiga abraçando outra com um sorriso solidário" />
          
          <h2>Comece sua jornada</h2>
          
          <p className='side-form__description'>Você já teve a sensação de que precisa de ajuda emocional, mas não sabe por onde começar? Isso te parece familiar?.</p>
    </section>
  )
}

export default SideForm

