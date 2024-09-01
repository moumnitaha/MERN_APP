import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import About from "./components/home/About";
import Landing from "./components/home/Landing";
import Home from "./components/home/Home";
import Login from "./components/auth/Login/Login";
import SignUp from "./components/auth/Signup/Signup";
import NotFound from "./components/NotFound";
import NavBar from "./components/home/NavBar";
import Products from "./components/home/Products";
import Product from "./components/home/Product";
import AuthProvider from "./lib/AuthProvider.jsx";
import AddProduct from "./components/home/addProduct.jsx";
import "react-toastify/dist/ReactToastify.css";
import Settings from "./components/home/Settings.jsx";
import Orders from "./components/home/Orders.jsx";
import AddOrder from "./components/home/addOrder.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<Landing />} index={true} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/addOrder" element={<AddOrder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
