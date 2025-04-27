import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Header from "./components/header";
import Inicio from "../pages/inicio";
import Login from "../pages/authentication/login";
import Register from "../pages/authentication/register";
import { ProductorInicio } from "../pages/productor/productorInicio";
import { ProductorProductoCrear } from "../pages/productor/productosCrear";
import { ProductorProductos } from "../pages/productor/productos";
import { ProductorPedidos } from "../pages/productor/pedidos";
import { ProductorEventos } from "../pages/productor/eventos";
import { ProductorFacturacion } from "../pages/productor/facturacion";

const My_Routes = () => {
  return (
    <>
      <BrowserRouter>
        <div className="w-100">
          <Header />
        </div>
        <div className="border-top">
          <Routes>
            <Route exact path="/" element={<Inicio />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />

            <Route exact path="/productor" element={<ProductorInicio />} />
            <Route exact path="/productor/productos" element={<ProductorProductos />} />
            <Route exact path="/productor/productos/crear" element={<ProductorProductoCrear />} />
            
            <Route exact path="/productor/pedidos" element={<ProductorPedidos />} />
            <Route exact path="/productor/facturacion" element={<ProductorFacturacion />} />
            <Route exact path="/productor/eventos" element={<ProductorEventos />} />
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
