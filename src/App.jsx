import { Routes, Route } from "react-router-dom";
import Login from './pages/form/Login'
import Cadastro from './pages/form/Cadastro'
import Conteudo from './pages/Conteudo/conteudo';
import Mensagens from './pages/mensagens/chat';
import ParaVoce from './pages/paraVoce/paraVoce';
import Begin from './pages/begin/Begin';
import MainLayout from './layouts/MainLayout';

function App() {
    return (
        <Routes>
                        {/* rotas públicas */}
                        <Route path='/' element={<Begin />} />
                        <Route path='/login' element={<Login />}/>
                        <Route path='/cadastro' element={<Cadastro />}/>

                        {/* rotas com sidebar persistente */}
                        <Route element={<MainLayout />}>
                            <Route path='/conteudo' element={<Conteudo />}/>
                            <Route path='/para-voce' element={<ParaVoce />}/>
                            <Route path='/mensagens' element={<Mensagens />}/>
                        </Route>
        </Routes>
    )
}

export default App;