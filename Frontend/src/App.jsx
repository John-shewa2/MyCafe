import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/Menupage';
import AdminPage from './pages/AdminPage';
import WaiterPage from './pages/WaiterPage';

const UserLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<UserLayout />}>
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/waiter" element={<WaiterPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;