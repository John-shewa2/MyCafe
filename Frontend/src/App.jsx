import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/Menupage';
import AdminPage from './pages/AdminPage'; 

// 1. Create a Layout Component
// This component wraps any page that NEEDS a Navbar
const UserLayout = () => {
  return (
    <>
      <Navbar />
      {/* Outlet is where the child route (like MenuPage) will render */}
      <Outlet />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- PUBLIC PAGES (No Navbar) --- */}
        {/* Changed: Default route "/" now shows LoginPage directly */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* --- USER PAGES (With Navbar) --- */}
        {/* Any route inside this group gets the UserLayout (Navbar) */}
        <Route element={<UserLayout />}>
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;