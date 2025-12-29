import { Routes, Route } from "react-router-dom";
import Login from './pages/login/Login'

function App() {
    return (
        <Routes>
            <Route path='/' element={<h1>Em progresso...</h1>}/>
            <Route path='/login' element={<Login />}/>
        </Routes>
    )
}

export default App;