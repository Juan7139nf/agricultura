import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { get, onValue, ref } from "firebase/database";
import { database } from "../firebase/firebase";
import { NavLink } from "react-router-dom";
import { getAuth } from "firebase/auth";

const StarRating = ({ rating, reviews }) => (
  <div
    className="rating"
    aria-label={`Calificación ${rating} de 5, basado en ${reviews} reseñas`}
  >
    {[...Array(4)].map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill="#ffc107"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
      </svg>
    ))}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="#ffc107"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path d="M5.354 5.119 7.538.792A.52.52 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.54.54 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.5.5 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.6.6 0 0 1 .085-.302.51.51 0 0 1 .37-.245zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.56.56 0 0 1 .162-.505l2.907-2.77-4.052-.576a.53.53 0 0 1-.393-.288L8.001 2.223 8 2.226z" />
    </svg>
    <span className="rating-text">
      {rating} ({reviews})
    </span>
  </div>
);

export default function ProductDestacado() {
  const [products, setProducts] = useState([]);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const productosRef = ref(database, "productos");

    const unsubscribe = onValue(productosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listaProductos = Object.entries(data).map(([id, producto]) => ({
          id,
          ...producto,
        }));
        setProducts(listaProductos);
      }
    });

    return () => unsubscribe();
  }, []);

  const [zoomIndex, setZoomIndex] = useState(null);

  const handleAdd = (productName) => {
    alert(`Agregaste ${productName} al carrito.`);
  };

  return (
    <div className="container">
      <span className="h1 fw-bolder d-block mb-4" style={{ textAlign: "left" }}>
        Productos
      </span>

      <div className="product-grid" role="list">
        {products.map((product, idx) => (
          <div key={idx} className="product-card" role="listitem">
            <NavLink
              to={`/detalle/${product.id}`}
              className="link-underline link-underline-opacity-0 text-body-emphasis h-100"
            >
              <div className="d-flex flex-column h-100">
                <div className="product-img-link">
                  <img
                    src={product.url}
                    alt={product.nombre}
                    className={`product-img${
                      zoomIndex === idx ? " zoomed" : ""
                    }`}
                    loading="lazy"
                  />
                </div>
                <div className="px-3 pt-1">
                  <span className="category-link text-muted small">
                    {product.categoria}
                  </span>
                </div>
                <h2 className="px-3">
                  <p className="title-link fs-4 fw-bolder lh-1 mb-0">
                    {product.nombre}
                  </p>
                </h2>
                {/*<StarRating rating={product.rating} reviews={product.reviews} />*/}
                <div className="d-flex justify-content-between align-content-center px-3 pb-3 mt-auto">
                  <div>
                    {product?.precioOferta === 0 ||
                    product?.precioOferta == null ? (
                      <>
                        <div className="fw-bold fs-4">{product?.precio} Bs</div>
                      </>
                    ) : (
                      <>
                        <div className="lh-1">
                          <div className="text-decoration-line-through text-muted small">
                            {product?.precio} Bs
                          </div>
                          <div className="fw-bold fs-4">
                            {product?.precioOferta} Bs
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="m-auto me-0">
                    <button className="btn btn-primary fw-bolder ps-1">
                      <AddIcon />
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
}
