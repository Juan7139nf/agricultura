import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, ToggleButton } from "react-bootstrap";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getAuth } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { database } from "../../scripts/firebase/firebase";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

export function CarritoIndex() {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const userCarritoRef = ref(database, `usuarios/${user.uid}/carrito`);
    const productosRef = ref(database, `productos`);

    let carritoData = {};
    let productosData = {};

    const actualizarCarrito = () => {
      if (!carritoData || !productosData) return;

      // Agrupar cantidades
      const agrupado = {};
      Object.entries(carritoData).forEach(([id, item]) => {
        if (agrupado[id]) {
          agrupado[id].cantidad += item.cantidad;
        } else {
          agrupado[id] = { id, cantidad: item.cantidad };
        }
      });

      // Unir con productos
      const lista = Object.values(agrupado).map((item) => {
        const producto = productosData[item.id];
        return {
          ...item,
          ...producto,
        };
      });

      setCarrito(lista);
      const totalCalculado = lista.reduce((acc, item) => {
        const precio = parseFloat(item.precio) || 0;
        const cantidad = parseInt(item.cantidad) || 0;
        return acc + precio * cantidad;
      }, 0);

      setTotal(totalCalculado);
    };

    const unsubscribeCarrito = onValue(userCarritoRef, (snapshot) => {
      carritoData = snapshot.exists() ? snapshot.val() : {};
      actualizarCarrito();
    });

    const unsubscribeProductos = onValue(productosRef, (snapshot) => {
      productosData = snapshot.exists() ? snapshot.val() : {};
      actualizarCarrito();
    });

    return () => {
      unsubscribeCarrito();
      unsubscribeProductos();
    };
  }, [user]);

  return (
    <>
      <div className="container py-4">
        <h1>Carrito de compras</h1>
        <div className="row">
          <div className="col-lg-8 col-md-7">
            <div className="p-3">
              <ul className="list-group list-group-flush">
                {carrito.map((e, i) => (
                  <li key={i} className="py-3 ps-0 border-top list-group-item">
                    <div className="row">
                      <div className="col-7">
                        <div className="d-flex">
                          <div className="">
                            <img src={e?.url} alt="" srcset="" width={64} />
                          </div>
                          <div className="">
                            <h3 className="ms-3 text-break">{e.nombre}</h3>
                            <Button variant="link link-underline link-underline-opacity-0">
                              <DeleteOutlineIcon className="text-success" />
                              <span className="text-body-emphasis">
                                Eliminar
                              </span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="col-5">
                        {e?.precioOferta ? (
                          <h5>{e.precioOferta} Bs</h5>
                        ) : (
                          <h5>{e?.precio} Bs</h5>
                        )}
                        <ButtonGroup className="mb-2">
                          <ToggleButton
                            type="radio"
                            variant="secondary"
                            name="radio"
                            className="p-1"
                          >
                            <RemoveIcon />
                          </ToggleButton>
                          <span className="btn btn-secondary active">
                            {e.cantidad}
                          </span>
                          <ToggleButton
                            type="radio"
                            variant="secondary"
                            name="radio"
                            className="p-1"
                          >
                            <AddIcon />
                          </ToggleButton>
                        </ButtonGroup>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-lg-4 col-md-5 col-12">
            <div className="my-4 card">
              <div className="p-3 card-body">
                <div className="d-grid mb-1 mt-4">
                  <Button>
                    <div className="d-flex justify-content-between">
                      <div className="fw-bolder">Ir a caja</div>
                      <div className="fw-bolder">{total} Bs</div>
                    </div>
                  </Button>
                </div>
                <p>
                  <small>
                    Al realizar su pedido, usted acepta estar sujeto a los
                    Términos de servicio y la Política de privacidad de
                    Freshcart.
                  </small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
