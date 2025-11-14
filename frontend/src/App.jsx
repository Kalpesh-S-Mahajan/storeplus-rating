import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Stores from "./pages/Stores";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStores from "./pages/admin/AdminStores";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import ChangePassword from "./pages/ChangePassword";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  // 🧠 Re-sync app state with localStorage instantly
  useEffect(() => {
    const syncLocalStorage = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };
    window.addEventListener("storage", syncLocalStorage);
    return () => window.removeEventListener("storage", syncLocalStorage);
  }, []);

  // 🔒 Protected route wrapper
  const privateRoute = (Component, allowedRoles = []) =>
    token && allowedRoles.includes(role) ? (
      <Component />
    ) : (
      <Navigate to="/" replace />
    );

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={privateRoute(AdminDashboard, ["admin"])}
        />
        <Route
          path="/admin/users"
          element={privateRoute(AdminUsers, ["admin"])}
        />
        <Route
          path="/admin/stores"
          element={privateRoute(AdminStores, ["admin"])}
        />

        {/* Store Owner */}
        <Route
          path="/owner/dashboard"
          element={privateRoute(OwnerDashboard, ["store_owner"])}
        />

        {/* Normal User */}
        <Route path="/stores" element={privateRoute(Stores, ["normal"])} />

        {/* 🚀 Smart Redirect */}
        <Route
          path="/dashboard"
          element={
            token ? (
              role === "admin" ? (
                <Navigate to="/admin/dashboard" replace />
              ) : role === "store_owner" ? (
                <Navigate to="/owner/dashboard" replace />
              ) : (
                <Navigate to="/stores" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route
          path="/change-password"
          element={token ? <ChangePassword /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
