import React from "react";
import { NavLink } from "react-router-dom";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

export function Adminicio() {
  return (
    <>
      <div
        className="card border-0 rounded-4 bg-light"
        style={{
          backgroundImage: 'url("/img/slider-image-1.webp")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <div className="card-body p-lg-5 text-black">
          <h1>¡Bienvenido de nuevo!</h1>
          <p>'agregar nombre del admin'</p> {/* Agregar nombre del admin */}
        </div>
      </div>

      <div className="table-responsive-xl mb-6 mb-lg-0 pt-4">
        <div className="row flex-nowrap pb-3 pb-lg-0">
          {/* Earnings Card */}
          <div className="col-lg-4 col-12 mb-6">
            <div className="card card-lg h-100">
              <div className="card-body p-6">
                <div className="d-flex justify-content-between align-items-center mb-6">
                  <div>
                    <h4 className="mb-0 fs-5">Ganancias</h4>
                  </div>
                  <div className="icon-shape icon-md bg-danger bg-opacity-25 text-danger rounded-circle p-1">
                    <AttachMoneyIcon />
                  </div>
                </div>
                <div className="lh-1">
                  <h1 className="mb-2 fw-bold fs-2">3456 bs</h1>
                  <span>Ingresos mensuales</span>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="col-lg-4 col-12 mb-6">
            <div className="card card-lg h-100">
              <div className="card-body p-6">
                <div className="d-flex justify-content-between align-items-center mb-6">
                  <div>
                    <h4 className="mb-0 fs-5">Pedidos</h4>
                  </div>
                  <div className="icon-shape icon-md bg-warning bg-opacity-25 text-warning rounded-circle p-1">
                    <ShoppingCartOutlinedIcon />
                  </div>
                </div>
                <div className="lh-1">
                  <h1 className="mb-2 fw-bold fs-2">42</h1>
                  <span>
                    <span className="text-body fw-bolder me-1">30</span>ventas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Card */}
          <div className="col-lg-4 col-12 mb-6">
            <div className="card card-lg h-100">
              <div className="card-body p-6">
                <div className="d-flex justify-content-between align-items-center mb-6">
                  <div>
                    <h4 className="mb-0 fs-5">Nuevos Usuarios</h4>
                  </div>
                  <div className="icon-shape icon-md bg-info bg-opacity-25 text-info rounded-circle p-1">
                    <PeopleOutlineIcon />
                  </div>
                </div>
                <div className="lh-1">
                  <h1 className="mb-2 fw-bold fs-2">39</h1>
                  <span>
                    <span className="text-body fw-bolder me-1">14</span> nuevos
                    en 2 días
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NUEVAS TARJETAS DE GESTIÓN */}
        <div className="row pt-5">
          <div className="col-md-4 mb-4">
            <NavLink to="/gestionusuarios" className="text-decoration-none">
              <div className="card h-100 text-center shadow-sm card-hover">
                <div className="card-body d-flex align-items-center justify-content-center">
                  <h5 className="fw-bold">Gestionar Usuarios</h5>
                </div>
              </div>
            </NavLink>
          </div>

          <div className="col-md-4 mb-4">
            <NavLink to="/gestionproductores" className="text-decoration-none">
              <div className="card h-100 text-center shadow-sm card-hover">
                <div className="card-body d-flex align-items-center justify-content-center">
                  <h5 className="fw-bold">Gestionar Productores</h5>
                </div>
              </div>
            </NavLink>
          </div>

          <div className="col-md-4 mb-4">
            <NavLink to="/gestioncomerciante" className="text-decoration-none">
              <div className="card h-100 text-center shadow-sm card-hover">
                <div className="card-body d-flex align-items-center justify-content-center">
                  <h5 className="fw-bold">Gestionar Comerciantes</h5>
                </div>
              </div>
            </NavLink>
          </div>
          <div className="col-md-4 mb-4">
            <NavLink to="/gestionpedido" className="text-decoration-none">
              <div className="card h-100 text-center shadow-sm card-hover">
                <div className="card-body d-flex align-items-center justify-content-center">
                  <h5 className="fw-bold">Gestionar Pedidos</h5>
                </div>
              </div>
            </NavLink>
          </div>

          <div className="col-md-4 mb-4">
            <NavLink to="/gestionevento" className="text-decoration-none">
              <div className="card h-100 text-center shadow-sm card-hover">
                <div className="card-body d-flex align-items-center justify-content-center">
                  <h5 className="fw-bold">Gestión de Eventos</h5>
                </div>
              </div>
            </NavLink>
          </div>

          <div className="col-md-4 mb-4">
            <NavLink to="/facturacion" className="text-decoration-none">
              <div className="card h-100 text-center shadow-sm card-hover">
                <div className="card-body d-flex align-items-center justify-content-center">
                  <h5 className="fw-bold">Facturación</h5>
                </div>
              </div>
            </NavLink>
          </div>
        </div>
      </div>

      <style>{`
        .card-hover {
          background-color: #889397; /* Color similar al fondo */
          transition: border 0.3s ease-in-out;
        }

        .card-hover:hover {
          border: 2px solid #0aad0a; /* Ilumina el borde al pasar el mouse */
        }
      `}</style>
    </>
  );
}
