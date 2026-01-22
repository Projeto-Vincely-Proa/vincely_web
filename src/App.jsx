import { Routes, Route } from "react-router-dom";
import Login from './pages/form/Login'
import Cadastro from './pages/form/Cadastro'
import Conteudo from './pages/Conteudo/conteudo';
import Begin from './pages/begin/Begin';
import Perfil from './pages/perfil/Perfil';
import PerfilEditado from  './pages/perfil/editar/PerfilEditado';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Begin />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/cadastro' element={<Cadastro />}/>
            <Route path='/conteudo' element={<Conteudo />}/>
            <Route path='/perfil' element={<Perfil />}/>
            <Route path='/perfil/editar' element={<PerfilEditado />}/>
        </Routes>
    )
}

export default App;