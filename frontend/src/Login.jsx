// Import the necessary hooks
import React, { useState } from "react"; // Import useState from React
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState(""); // Hook for email input state
  const [password, setPassword] = useState(""); // Hook for password input state
  const [localError, setLocalError] = useState(""); // Hook for error messages
  const [loading, setLoading] = useState(false); // Hook for loading state
  const navigate = useNavigate(); // useNavigate hook to handle page navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError("Email and password are required.");
      return;
    }
    setLocalError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();
      // Call onLogin with the user data here
      onLogin(data); // This will update the user state in App.js
      navigate("/dashboard");
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Login</h2>
      {localError && <p style={{ color: "red" }}>{localError}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
            disabled={loading}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="password">Password</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          style={{ padding: "10px 20px" }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

// import React, { useState } from "react";
//
// export default function LoginPage({ onLogin, errorMessage }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [localError, setLocalError] = useState("");
//   const [loading, setLoading] = useState(false);
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       setLocalError("Email and password are required.");
//       return;
//     }
//     setLocalError("");
//     setLoading(true);
//
//     try {
//       // Updated the URL to match your Go server's address
//       const res = await fetch("http://localhost:8080/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
//
//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Login failed");
//       }
//
//       const data = await res.json();
//       onLogin(data.user); // Use the response data directly
//     } catch (err) {
//       setLocalError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <div
//       style={{
//         maxWidth: "400px",
//         margin: "50px auto",
//         fontFamily: "sans-serif",
//       }}
//     >
//       <h2>Login</h2>
//
//       {localError && <p style={{ color: "red" }}>{localError}</p>}
//       {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
//
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: "10px" }}>
//           <label htmlFor="email">Email</label>
//           <br />
//           <input
//             id="email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             style={{ width: "100%", padding: "8px" }}
//             disabled={loading}
//           />
//         </div>
//
//         <div style={{ marginBottom: "10px" }}>
//           <label htmlFor="password">Password</label>
//           <br />
//           <input
//             id="password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             style={{ width: "100%", padding: "8px" }}
//             disabled={loading}
//           />
//         </div>
//
//         <button
//           type="submit"
//           style={{ padding: "10px 20px" }}
//           disabled={loading}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// }
