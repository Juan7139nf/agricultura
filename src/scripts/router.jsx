import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Header from "./components/header";
import Inicio from "../pages/inicio";
import Login from "../pages/authentication/login";

import { Adminicio } from "../pages/admin/admininicio";

import { ProductorInicio } from "../pages/productor/productorInicio";
import { ProductorProductoCrear } from "../pages/productor/productosCrear";
import { ProductorProductos } from "../pages/productor/productos";
import { ProductorPedidos } from "../pages/productor/pedidos";
import { ProductorEventos } from "../pages/productor/eventos";
import { ProductorFacturacion } from "../pages/productor/facturacion";
import { ProductorInicioUI } from "./ui/productor/productorInicioUI";

import GestionProductores from "../pages/admin/gestionproduc";

import GestionEvento from "../pages/admin/gestionevento";
import GestionPedido from "../pages/admin/gestionpedido";
import GestionProductos from "../pages/admin/gestionproductos";
import { ProductorProductoEditar } from "../pages/productor/productosEditar";
import DetalleProductoDiseño from "../pages/cliente/detalleproductodiseño";
import { ProductosClient } from "../pages/cliente/productos";
import { CarritoIndex } from "../pages/cliente/cart";
import { PedidoDesing } from "../pages/cliente/pedido";

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
            <Route exact path="/productos" element={<ProductosClient />} />

            <Route exact path="/cart" element={<CarritoIndex />} />

            <Route exact path="/pedido" element={<PedidoDesing />} />

            <Route
              exact
              path="/detalle/:id"
              element={<DetalleProductoDiseño />}
            />

            <Route exact path="/adminicio" element={<Adminicio />} />
            <Route
              exact
              path="/gestionproductores"
              element={<GestionProductores />}
            />
            <Route exact path="/gestionevento" element={<GestionEvento />} />
            <Route
              exact
              path="/admin/productos"
              element={<GestionProductos />}
            />
            <Route path="/gestionpedido" element={<GestionPedido />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/paneladmin" element={<Adminicio />} />
            <Route exact path="/productor" element={<ProductorInicio />} />
            <Route
              exact
              path="/productor/productos"
              element={<ProductorProductos />}
            />
            <Route
              exact
              path="/productor/productos/crear"
              element={<ProductorProductoCrear />}
            />
            <Route
              path="/productor/productos/editar/:id"
              element={<ProductorProductoEditar />}
            />
            <Route
              exact
              path="/productor/pedidos"
              element={<ProductorPedidos />}
            />
            <Route
              exact
              path="/productor/facturacion"
              element={<ProductorFacturacion />}
            />
            <Route
              exact
              path="/productor/eventos"
              element={<ProductorEventos />}
            />
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

ADMINISTRADOR 
BASE DE DATOS CREAR
1. **Login FALTA  QUE VALIDE 
/Registro**
2. Panel del Productor //NICO
   - Inicio
   - Facturacion
   - Ver productos (gestion de productos)
   - Añadir producto (gestion de productos )
   - Ver pedidos recibidos (gestion de pedidos)
   - Eventos
3. Panel del Comerciante //EZEQUIEL (TODO)
   -Inicio (Ver los productos para comprar y revender)
   - (gestion de productos) CREAR,VER, EDITAR "MIS" PRODUCTOS
   -Gestion de pedidos (tus productos de vos por vender)
   - Ver "mis" pedidos que voy a comprar
   - Ver mis facturas (compraste) y ver las facturas (vendiste) 
   -Eventos 
4. Panel de Administración //MICA
   - Crear ferias(gestion de ventas)
   - Controlar usuarios FALTA TODO
   -Gestion de productores y comerciantes
   -Gestion de pedidos
   -Gestion de eventos
   -Facturacion(FALTA) NOTIFICACIONES
5. Página de cliente //MAY(TODO)
   -INICIO 
   - Carrito de compras
   -Pedido
   -Gestion de perfil (configuracion)

*/
