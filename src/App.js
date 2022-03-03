import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/main/dashboard/Dashboard';
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
import Discount from './components/main/discount/Discount';
import ShowDiscount from './components/main/discount/ShowDiscount';
import AddDiscount from './components/main/discount/AddDiscount';
import EditDiscount from './components/main/discount/EditDiscount';
import Infomation from './components/main/auth/Infomation';
import ShowInfomation from './components/main/auth/ShowInfomation';
import ChangePassword from './components/main/auth/ChangePassword';
import Orders from './components/main/Order/Orders';
import ShowOrders from './components/main/Order/ShowOrders';
import EditOrders from './components/main/Order/EditOrders';
import AddToProduct from './components/main/discount/AddToProduct';

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
          <Route path="editcategory" element={<EditCategory />} />
          <Route path="addcategory" element={<AddCategory />} />
        </Route>
        <Route path="/discount" element={<Discount />}>
          <Route path="showdiscount" element={<ShowDiscount />} />
          <Route path="editdiscount" element={<EditDiscount />} />
          <Route path="adddiscount" element={<AddDiscount />} />
          <Route path="addToProduct" element={<AddToProduct />} />
        </Route>
        <Route path="/infomation" element={<Infomation />}>
          <Route path="showInfomation" element={<ShowInfomation />} />
          <Route path="changePassword" element={<ChangePassword />} />
        </Route>
        <Route path="/orders" element={<Orders />}>
          <Route path="showorders" element={<ShowOrders />} />
          <Route path="editorders" element={<EditOrders />} />
        </Route>
        <Route path="*" element={<Authenticate to="/authenticate" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
