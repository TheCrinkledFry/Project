// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Login";
import Home from "./Home";
import Products from "./Products";
import Orders from "./Orders";
import PrivateRoute from "./PrivateRoute";

function App() {
  const [error, setError] = React.useState("");

  const handleLogin = ({ token }) => {
    if (token) {
      localStorage.setItem("authToken", token);
      window.location.href = "/dashboard"; // navigate after login
    } else {
      setError("Invalid login response");
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LoginPage onLogin={handleLogin} errorMessage={error} />}
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Home>
                <Products />
              </Home>
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Home>
                <Orders />
              </Home>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
