import { Routes, Route } from "react-router-dom";
import Login from './pages/form/Login'
import Cadastro from './pages/form/Cadastro'
import Conteudo from './pages/Conteudo/conteudo';
import Begin from './pages/begin/Begin';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Begin />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/cadastro' element={<Cadastro />}/>
            <Route path='/conteudo' element={<Conteudo />}/>
        </Routes>
    )
}

export default App;