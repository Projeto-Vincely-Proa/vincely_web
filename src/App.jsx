import { Routes, Route } from "react-router-dom";
import Begin from './pages/begin/Begin';

function App() {
  return (
    <>
    <div className="App">
     
      <Routes>
            <Route path='/' element={<Begin />}/>
     </Routes>
    </div>
    </>
  );
}

export default App;