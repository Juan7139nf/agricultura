import { getAuth } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { database, ref } from "../../scripts/firebase/firebase";
import { get, set, update } from "firebase/database";
import {
  Button,
  ButtonGroup,
  CloseButton,
  ToggleButton,
} from "react-bootstrap";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import toast, { Toaster } from "react-hot-toast";

const DetalleProductoDiseño = () => {
  const [cantidad, setCantidad] = useState(1);
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const { id } = useParams(); // ID del producto desde la URL

  // Cargar los datos del producto
  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const productoRef = ref(database, `productos/${id}`);
        const snapshot = await get(productoRef);
        if (snapshot.exists()) {
          const producto = snapshot.val();
          producto.id = id; // asignamos manualmente el id desde useParams
          setData(producto);
        } else {
          toast.error("Producto no encontrado.");
          navigate("/productor/productos");
        }
      } catch (error) {
        toast.error("Error al cargar el producto: " + error.message);
      }
    };

    cargarProducto();
  }, [id, navigate]);

  const manejarIncremento = () => {
    setCantidad((prevCantidad) => prevCantidad + 1);
  };

  const manejarDecremento = () => {
    if (cantidad > 1) {
      setCantidad((prevCantidad) => prevCantidad - 1);
    }
  };

  function agregarAlCarrito() {
    if (!user) {
      toast.error("Debes iniciar sesión para agregar productos al carrito.");
      return;
    }

    if (!data || !data.id) {
      toast.error("Producto no válido.");
      return;
    }

    // Obtén la fecha actual
    const fecha = new Date().toISOString(); // La fecha en formato ISO (YYYY-MM-DDTHH:mm:ss.sssZ)

    // Crea un objeto con la estructura que deseas guardar, incluyendo el cliente id
    const productoConDetalles = {
      id: data.id,
      nombre: data.nombre, // Puedes agregar el nombre o cualquier otro detalle
      precio: data.precio, // Agregar precio del producto
      fecha: fecha,
      cantidad: cantidad,
      clienteId: user.uid, // Guarda el cliente id
    };

    // referencia al carrito del usuario
    const productoRef = ref(
      database,
      `usuarios/${user.uid}/carrito/${data.id}` // Guardar en el carrito del usuario
    );

    // Verifica si el producto ya existe en el carrito
    get(productoRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          // Si ya existe, actualizar la cantidad
          const productoExistente = snapshot.val();
          const nuevaCantidad = cantidad;

          // Asegúrate de que la cantidad no sea menor que 1
          if (nuevaCantidad < 1) {
            toast.error("La cantidad no puede ser menor que 1.");
            return;
          }

          // Actualiza la cantidad del producto
          update(productoRef, { cantidad: nuevaCantidad })
            .then(() => {
              toast.success("Producto actualizado en el carrito.");
            })
            .catch((error) => {
              console.error("Error al actualizar el carrito: ", error);
              toast.error("Error al actualizar el producto en el carrito.");
            });
        } else {
          // Si no existe, crear nuevo producto en el carrito
          set(productoRef, productoConDetalles)
            .then(() => {
              toast.success("Producto agregado al carrito.");
            })
            .catch((error) => {
              console.error("Error al agregar al carrito: ", error);
              toast.error("Error al agregar el producto al carrito.");
            });
        }
      })
      .catch((error) => {
        console.error("Error al verificar el carrito: ", error);
        toast.error("Error al verificar el carrito.");
      });
  }

  return (
    <>
      <div className="container py-4">
        <div className="text-end">
          <CloseButton onClick={() => navigate(-1)} />
        </div>
        <div className="row">
          <div className="col-md-6">
            <img src={data?.url} alt="" srcset="" className="w-100" />
          </div>
          <div className="col-md-6">
            <h6 className="mb-4 d-block text-primary">{data?.categoria}</h6>
            <h1 className="mb-4">{data?.nombre}</h1>
            <div className="fs-4">
              {data?.precioOferta === 0 ? (
                <>
                  <div className="fw-bold">{data?.precio}</div>
                </>
              ) : (
                <>
                  <div className="d-flex">
                    <div className="text-decoration-line-through text-muted">
                      {data?.precio} Bs
                    </div>
                    <div className="ms-3 fw-bold">{data?.precioOferta} Bs</div>
                  </div>
                </>
              )}
            </div>
            <hr />
            <ButtonGroup className="mb-2">
              <ToggleButton
                type="radio"
                variant="secondary"
                name="radio"
                className="p-1"
                onClick={manejarDecremento}
              >
                <RemoveIcon />
              </ToggleButton>
              <span className="btn btn-secondary active">{cantidad}</span>
              <ToggleButton
                type="radio"
                variant="secondary"
                name="radio"
                className="p-1"
                onClick={manejarIncremento}
              >
                <AddIcon />
              </ToggleButton>
            </ButtonGroup>
            <br />
            <Button className="fw-bolder mb-1" onClick={agregarAlCarrito}>
              <ShoppingCartIcon /> Añadir al carrito
            </Button>
            <hr />
            <table className="table table-borderless mb-2">
              <tbody>
                {data?.codigo && (
                  <tr>
                    <td className="text-muted">Código del producto:</td>
                    <td className="text-muted">{data?.codigo}</td>
                  </tr>
                )}
                <tr>
                  <td className="text-muted">Disponibilidad:</td>
                  <td className="text-muted">
                    {data?.stock ? "En stock" : "Fuera de stock"}
                  </td>
                </tr>
                {data?.categoria && (
                  <tr>
                    <td className="text-muted">Tipo:</td>
                    <td className="text-muted">{data?.categoria}</td>
                  </tr>
                )}
                {data?.peso && (
                  <tr>
                    <td className="text-muted">Peso:</td>
                    <td className="text-muted">
                      {data?.peso} {data?.unidad}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="col-12 border-top py-3 ql-editor">
            <div dangerouslySetInnerHTML={{ __html: data?.descripcion }} />
          </div>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default DetalleProductoDiseño;
