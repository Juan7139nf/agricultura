import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Header from "./components/header";
import Inicio from "../pages/inicio";
import Login from "../pages/authentication/login";
import Register from "../pages/authentication/register";

const My_Routes = () => {
  return (
    <>
      <BrowserRouter>
        <div className="w-100">
          <Header />
        </div>
        <div className="">
          <Routes>
            <Route exact path="/" element={<Inicio />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
};

export default My_Routes;

/*

1. **Login/Registro**
2. Panel del Productor
   - Ver productos
   - Añadir producto
   - Ver pedidos recibidos
3. Panel del Comerciante
   - Ver todos los productos
   - Ver pedidos
   - Ver facturas
4. Panel de Administración
   - Crear ferias
   - Controlar usuarios
5. Página de cliente
   - Buscar productos
   - Comprar
   - Ver pedidos y facturas

*/
