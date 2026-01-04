import { Routes, Route } from "react-router-dom";
import Login from './pages/Login/login'
import Conteudo from './pages/Conteudo/conteudo';

function App() {
    return (
        <Routes>
            <Route path='/' element={<h1>Em progresso...</h1>}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/conteudo' element={<Conteudo />}/>
        </Routes>
    )
}

export default App;