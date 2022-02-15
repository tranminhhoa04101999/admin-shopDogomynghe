import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./components/main/Dashboard";
import Products from "./components/main/Products";
import Layout from "./components/Layout";
import Login from "./components/main/auth/Login";
import Authenticate from "./components/main/auth/Authenticate";
import { useEffect } from "react";
import AddProduct from "./components/main/AddProduct";

export const LINKCONECT_BASE = "http://localhost:8080";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/authenticate" element={<Authenticate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />}>
          <Route path="addproduct" element={<AddProduct />} />
        </Route>

        <Route path="*" element={<Authenticate to="/authenticate" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
