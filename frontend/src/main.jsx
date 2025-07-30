import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import Products from "./Products.jsx"; // Import the Products component

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />{" "}
        {/* Route for Products */}
      </Routes>
    </Router>
  </React.StrictMode>,
);
