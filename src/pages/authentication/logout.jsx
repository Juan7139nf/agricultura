import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../scripts/firebase/firebase";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Usuario cerrado sesión");

      localStorage.removeItem("user");

      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div>
      <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default Logout;

const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log("Usuario cerrado sesión");

    localStorage.removeItem("user");

    window.location.href = "/login";
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

export { handleLogout };
