import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      {/* Ici on mettra la barre de navigation (Navbar) plus tard */}

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      {/* Ici on mettra le pied de page (Footer) plus tard */}
    </div>
  )
}

export default App;
