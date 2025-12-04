import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/Menupage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* When the URL is "/", show HomePage */}
        <Route path="/" element={<HomePage />} />
        
        {/* When the URL is "/login", show LoginPage */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* When the URL is "/menu", show MenuPage */}
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;