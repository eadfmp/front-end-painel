import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Painel from './pages/painel.jsx';
import Admin from './pages/admin.jsx';
function App() {

  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<Painel/>}/>
       <Route path= "/admin" element={<Admin/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
