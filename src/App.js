import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/main/Dashboard';
import Products from './components/main/product/Products';
import Layout from './components/Layout';
import Login from './components/main/auth/Login';
import Authenticate from './components/main/auth/Authenticate';
import AddProduct from './components/main/product/AddProduct';
import ShowProduct from './components/main/product/ShowProduct';
import EditProduct from './components/main/product/EditProduct';
import Account from './components/main/account/Account';
import ShowAccount from './components/main/account/ShowAccount';
import AddAccount from './components/main/account/AddAccount';
import EditAccount from './components/main/account/EditAccount';
import Category from './components/main/category/Category';
import AddCategory from './components/main/category/AddCategory';
import ShowCategory from './components/main/category/ShowCategory';
import EditCategory from './components/main/category/EditCategory';

export const LINKCONECT_BASE = 'http://localhost:8080';
export const LINKIMG_BASE =
  'https://firebasestorage.googleapis.com/v0/b/image-kddgmn-52ebf.appspot.com/o/images%2F';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Account />}>
          <Route path="showAccount" element={<ShowAccount />} />
          <Route path="editAccount" element={<EditAccount />} />
          <Route path="addAccount" element={<AddAccount />} />
        </Route>

        <Route path="/products" element={<Products />}>
          <Route path="showproduct" element={<ShowProduct />} />
          <Route path="editproduct" element={<EditProduct />} />
          <Route path="addproduct" element={<AddProduct />} />
        </Route>
        <Route path="/category" element={<Category />}>
          <Route path="showcategory" element={<ShowCategory />} />
          <Route path="editproduct" element={<EditCategory />} />
          <Route path="addproduct" element={<AddCategory />} />
        </Route>

        <Route path="*" element={<Authenticate to="/authenticate" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
