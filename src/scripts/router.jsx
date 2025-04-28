import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Header from "./components/header";
import Inicio from "../pages/inicio";
import Login from "../pages/authentication/login";
import Register from "../pages/authentication/register";
import { Adminicio } from "../pages/admin/admininicio";

import { ProductorInicio } from "../pages/productor/productorInicio";
import { ProductorProductoCrear } from "../pages/productor/productosCrear";
import { ProductorProductos } from "../pages/productor/productos";
import { ProductorInicioUI } from "./ui/productor/productorInicioUI";
import GestionUsuarios from "../pages/admin/gestionusuarios";
import GestionProductores from "../pages/admin/gestionproduc";
import GestionComerciante from "../pages/admin/gestioncomerciante";
import GestionEvento from "../pages/admin/gestionevento";
import EventoView from "../pages/admin/eventoview";
import GestionPedido from "../pages/admin/gestionpedido";

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
            <Route exact path="/adminicio" element={<Adminicio />}/>
            <Route exact path="/gestionusuarios" element={<GestionUsuarios/>}/>
            <Route exact path="/gestionproductores" element={<GestionProductores/>}/>
            <Route exact path="/gestioncomerciante" element={<GestionComerciante/>}/>
            <Route exact path="/gestionevento" element={<GestionEvento/>}/>
            <Route exact path="/eventoview" element={<EventoView/>}/>
            <Route path="/gestionpedido" element={<GestionPedido />} />
            
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/paneladmin" element={<Adminicio />}/>

            <Route exact path="/productor" element={<ProductorInicio />} />
            <Route exact path="/productor/productos" element={<ProductorProductos />} />
            <Route exact path="/productor/productos/crear" element={<ProductorProductoCrear />} />
            {/* Esto es un comentario en JSX 
            <Route exact path="/" element={<ProductorInicioUI />} />
            <Route exact path="/" element={<Inicio />} />
            */}
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
