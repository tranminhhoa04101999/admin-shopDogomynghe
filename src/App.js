import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/main/Dashboard';
import Products from './components/main/product/Products';
import Layout from './components/Layout';
import Login from './components/main/auth/Login';
import Authenticate from './components/main/auth/Authenticate';
import AddProduct from './components/main/product/AddProduct';
import ShowProduct from './components/main/product/ShowProduct';

export const LINKCONECT_BASE = 'http://localhost:8080';
export const LINKIMG_BASE = 'https://drive.google.com/uc?id=';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />}>
          <Route path="showproduct" element={<ShowProduct />} />
          <Route path="addproduct" element={<AddProduct />} />
        </Route>

        <Route path="*" element={<Authenticate to="/authenticate" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
