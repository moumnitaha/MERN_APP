import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import About from "./components/home/About";
import Home from "./components/home/Home";
import Login from "./components/auth/Login/Login";
import SignUp from "./components/auth/Signup/Signup";
import NotFound from "./components/NotFound";
import NavBar from "./components/home/NavBar";
import Products from "./components/home/Products";

function App() {
  return (
    <Router>
      <NavBar />
      {/* <div className="h-32"></div> */}
      <Routes>
        <Route path="/" element={<Home />} index />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/products" element={<Products />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
