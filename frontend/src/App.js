// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Login";
import Home from "./Home";
import Products from "./Products";
import Orders from "./Orders";
import PrivateRoute from "./PrivateRoute";

function App() {
  const [user, setUser] = useState(null); // Store user data in state

  const handleLogin = (userData) => {
    // Update the user state with the login data
    setUser(userData);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute user={user}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute user={user}>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute user={user}>
              <Orders />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LoginPage from "./Login";
// import Home from "./Home";
// import Products from "./Products";
// import Orders from "./Orders";
// import PrivateRoute from "./PrivateRoute";
//
// function App() {
//   const [user, setUser] = useState(null); // Store user data in state
//
//   const handleLogin = (userData) => {
//     // Only set user data in state for current session (no persistent storage)
//     setUser(userData);
//   };
//
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute user={user}>
//               <Home />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/products"
//           element={
//             <PrivateRoute user={user}>
//               <Products />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/orders"
//           element={
//             <PrivateRoute user={user}>
//               <Orders />
//             </PrivateRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }
//
// export default App;
