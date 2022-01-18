import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/main/Dashboard";
import Layout from "./components/Layout";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </Layout>
  );
}

export default App;
