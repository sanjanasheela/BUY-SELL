import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import RefrshHandler from "./RefrshHandler";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";

// import Home from  './pages/Home';
// function Login() {
//   return <h1>hiiii from login </h1>;
// }
// function Home() {
//   return <h1>hiiii from home</h1>;
// }
// function Signup() {
//   return <h1>hiiii from signup</h1>;
// }

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    console.log("token in the app.js", token);
    return token ? children : <Navigate to="/home" />;
  };

  return (
    <div className="App">
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
