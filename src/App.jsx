import { Routes, Route } from "react-router-dom";
import Login from './pages/form/Login'
import Cadastro from './pages/form/Cadastro'

function App() {
    return (
        <Routes>
            <Route path='/' element={<h1>Em progresso...</h1>}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/cadastro' element={<Cadastro />}/>
        </Routes>
    )
}

export default App;