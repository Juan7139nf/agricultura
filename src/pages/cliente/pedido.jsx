import React, { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Card,
  CloseButton,
  Col,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  equalTo,
  get,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { database } from "../../scripts/firebase/firebase";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export function PedidoDesing() {
  const [activeKey, setActiveKey] = useState("0");
  const [metodo, setMetodo] = useState("");
  const { id } = useParams();
  const [pedido, setPedido] = useState({ subTotal: 0, total: 0 });
  const [direccionN, setDireccionN] = useState({
    nombre: "",
    apellido: "",
    ciudad: "",
    direccion: "",
    codigoPostal: "000",
    telefono: "",
    predeterminado: false,
  });
  const [direccionE, setDireccionE] = useState({
    nombre: "",
    apellido: "",
    ciudad: "",
    direccion: "",
    codigoPostal: "000",
    telefono: "",
    predeterminado: false,
  });
  const [direccion, setDireccion] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [factura, setFacturacion] = useState([]);
  const [show, setShow] = useState(false);
  const [showE, setShowE] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseE = () => setShowE(false);
  const handleShowE = () => setShowE(true);

  useEffect(() => {
    let uid = "";
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) return;

      const direccionesRef = ref(
        database,
        `usuarios/${firebaseUser.uid}/direccion`
      );

      onValue(direccionesRef, (snapshot) => {
        const data = snapshot.val() || {};
        // Convierte a array si es necesario
        const direcciones = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setDirecciones(direcciones);
      });

      const pedidoRef = ref(database, `pedidos/${id}`);

      get(pedidoRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setPedido(snapshot.val());
            uid = snapshot.val().clientUid;
          } else {
            console.log("No se encontró el pedido");
          }
        })
        .catch((error) => {
          console.error("Error al obtener el pedido:", error);
        });

      const facturacionRef = ref(database, "facturacion");

      const consulta = query(
        facturacionRef,
        orderByChild("idPedido"),
        equalTo(id)
      );

      get(consulta)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const datos = snapshot.val();
            // Si deseas convertir el objeto a array:
            const facturas = Object.entries(datos).map(([key, value]) => ({
              id: key,
              ...value,
            }));

            setFacturacion(facturas[0]);

            // Puedes guardar las facturas en el estado si estás en React:
            // setFacturas(facturas);
          } else {
            console.log("No se encontraron facturas con ese idPedido");
          }
        })
        .catch((error) => {
          console.error("Error al obtener el usuario:", error);
        });

      usuarioObtener();
    });

    return () => unsubscribeAuth();
  }, [pedido.clientUid]);

  const usuarioObtener = () => {
    const usuarioRef = ref(database, `usuarios/${pedido.clientUid}`);

    get(usuarioRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const usuarioC = snapshot.val();
          setUsuario(usuarioC);
        } else {
          console.log("No se encontró el usuario");
        }
      })
      .catch((error) => {
        console.error("Error al obtener el usuario:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDireccionN((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleChangeE = (e) => {
    const { name, value, type, checked } = e.target;
    setDireccionE((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelect = (e) => {
    setMetodo(e.target.value);
  };

  const handleDireccion = (e) => {
    setDireccionE(e);
    setShowE(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const direccion = direccionN;
    const direccionRef = ref(database, `usuarios/${user.uid}/direccion`);
    push(direccionRef, direccion);
    setDireccionN({
      nombre: "",
      apellido: "",
      ciudad: "",
      direccion: "",
      codigoPostal: "000",
      telefono: "",
      predeterminado: false,
    });
    handleClose();
  };

  const handleSubmitDireccion = (e) => {
    e.preventDefault();
    if (!direccionE.id) return;

    const direccion = direccionE;
    const direccionRef = ref(
      database,
      `usuarios/${user.uid}/direccion/${direccionE.id}`
    );
    set(direccionRef, direccion) // <- aquí usamos set en lugar de push
      .then(() => {
        setDireccionE({
          nombre: "",
          apellido: "",
          ciudad: "",
          direccion: "",
          codigoPostal: "000",
          telefono: "",
          predeterminado: false,
        });
        handleCloseE();
      });
  };

  const eliminarItem = (id) => {
    const itemRef = ref(database, `usuarios/${user.uid}/direccion/${id}`);
    remove(itemRef);
  };

  const handleToggle = (key) => {
    // Solo permite abrir, pero no cerrar
    if (activeKey !== key) {
      setActiveKey(key);
    }
  };

  const FinalizarPedido = async (e) => {
    e.preventDefault();
    if (!metodo || direccion.length === 0) return;

    const facturacion = {
      auth: {
        uid: auth?.currentUser?.uid,
        displayName: auth?.currentUser?.displayName,
        email: auth?.currentUser?.email,
      },
      pedido,
      metodo,
      direccion,
      fecha: new Date().toISOString(),
      idPedido: id,
    };

    facturacion.pedido.estado = "completado";

    const pedidoRef = ref(database, `pedidos/${id}`);
    const facturacionRef = ref(database, "facturacion");

    const nuevaFacturacionRef = await push(facturacionRef, facturacion);
    await update(pedidoRef, {
      estado: "completado",
    });
    console.log(nuevaFacturacionRef.key);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const { width, height } = page.getSize();

    const drawCenteredText = (text, yOffset, isBold = false) => {
      const currentFont = isBold ? fontBold : font;
      const textWidth = currentFont.widthOfTextAtSize(text, 12);
      page.drawText(text, {
        x: (page.getWidth() - textWidth) / 2,
        y: yOffset,
        size: 12,
        font: currentFont,
        color: rgb(0, 0, 0),
      });
      return yOffset - 15;
    };

    const drawLabelValue = (label, value, yOffset) => {
      const labelWidth = fontBold.widthOfTextAtSize(label, 12);
      const valueWidth = font.widthOfTextAtSize(value, 12);
      const totalWidth = labelWidth + 5 + valueWidth;

      const x = (page.getWidth() - totalWidth) / 2;

      page.drawText(label, {
        x,
        y: yOffset,
        size: 12,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      page.drawText(value, {
        x: x + labelWidth + 5,
        y: yOffset,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });

      return yOffset - 15;
    };

    let y = height - 30;

    y = drawCenteredText("FACTURA", y, true);
    y = drawCenteredText("CON DERECHO A CRÉDITO FISCAL", y, true);
    y -= 15; // espacio adicional si deseas

    y = drawCenteredText("LOS ULTIMOS", y, true);
    y = drawCenteredText("UPDS - TARIJA", y, true);
    y = drawCenteredText("AVENIDA LOS SAUCES", y);
    y = drawCenteredText("ESQUINA FABIÁN RUIZ", y);
    y = drawCenteredText("ZONA/BARRIO: ", y);
    y = drawCenteredText("Tarija - Bolivia", y);
    y = drawCenteredText(".........................", y);
    y -= 10;
    y = drawCenteredText("FACTURA N.", y, true);
    y = drawCenteredText(nuevaFacturacionRef.key, y);
    y = drawCenteredText(".........................", y);
    y -= 10;
    y = drawLabelValue(
      "Cliente:",
      facturacion.auth?.displayName || "No disponible",
      y
    );
    y = drawLabelValue("Correo:", facturacion.auth?.email, y);
    y = drawLabelValue("Nombre:", facturacion.direccion?.nombre, y);
    y = drawLabelValue("Apellido:", facturacion.direccion?.apellido, y);
    y = drawLabelValue("Ciudad:", facturacion.direccion?.ciudad, y);
    y = drawLabelValue("Dirección:", facturacion.direccion?.direccion, y);
    y = drawLabelValue("Método de pago:", facturacion.metodo, y);
    y -= 10;
    y = drawCenteredText("DETALLE", y);

    const colWidths = [200, 60, 70, 80];
    const totalTableWidth = colWidths.reduce((a, b) => a + b, 0);
    const startX = (page.getWidth() - totalTableWidth) / 2;
    const colX = [
      startX,
      startX + colWidths[0],
      startX + colWidths[0] + colWidths[1],
      startX + colWidths[0] + colWidths[1] + colWidths[2],
    ];
    const rowHeight = 20;

    const drawCellBorder = (x, y, width, height) => {
      page.drawRectangle({
        x,
        y: y - height,
        width,
        height,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    };

    // Dibujar encabezado
    const colTitles = ["Descripción.", "Cant", "P. Unit", "Subtotal"];
    colTitles.forEach((title, i) => {
      drawCellBorder(colX[i], y, colWidths[i], rowHeight);
      page.drawText(title, {
        x: colX[i] + 5,
        y: y - 14,
        size: 12,
        font: fontBold,
      });
    });
    y -= rowHeight;

    // Dibujar filas de datos con bordes
    pedido.carrito.forEach((item) => {
      const precioI = item.precioOferta ? item.precioOferta : item.precio;
      const subtotal = precioI * item.cantidad;
      const precioF = parseFloat(precioI).toFixed(2);
      const valores = [
        item.nombre,
        `${item.cantidad}`,
        `${precioF}`,
        `${subtotal.toFixed(2)}`,
      ];

      valores.forEach((val, i) => {
        drawCellBorder(colX[i], y, colWidths[i], rowHeight);
        page.drawText(val, {
          x: colX[i] + 5,
          y: y - 14,
          size: 12,
          font,
        });
      });

      y -= rowHeight;
    });

    // Dibujar fila Subtotal
    const subtotalLabel = "Subtotal Bs:";
    const subtotalVal = `${pedido.subTotal.toFixed(2)}`;

    // Unir 3 columnas (Nombre, Cantidad, P.Unit)
    const mergedWidth = colWidths[0] + colWidths[1] + colWidths[2];
    drawCellBorder(colX[0], y, mergedWidth, rowHeight);
    drawCellBorder(colX[3], y, colWidths[3], rowHeight);
    page.drawText(subtotalLabel, {
      x: colX[0] + 5,
      y: y - 14,
      size: 12,
      font,
    });
    page.drawText(subtotalVal, {
      x: colX[3] + 5,
      y: y - 14,
      size: 12,
      font,
    });
    y -= rowHeight;

    // Dibujar fila Subtotal
    const subtotalLabel1 = "Impuesto IVA 18%:";
    const subtotalVal1 = `${(pedido.subTotal * 0.18).toFixed(2)}`;

    // Unir 3 columnas (Nombre, Cantidad, P.Unit)
    const mergedWidth1 = colWidths[0] + colWidths[1] + colWidths[2];
    drawCellBorder(colX[0], y, mergedWidth1, rowHeight);
    drawCellBorder(colX[3], y, colWidths[3], rowHeight);
    page.drawText(subtotalLabel1, {
      x: colX[0] + 5,
      y: y - 14,
      size: 12,
      font,
    });
    page.drawText(subtotalVal1, {
      x: colX[3] + 5,
      y: y - 14,
      size: 12,
      font,
    });
    y -= rowHeight;

    // Dibujar fila Total (en negrita)
    const totalLabel = "Total Bs:";
    const totalVal = `${pedido.total.toFixed(2)}`;

    drawCellBorder(colX[0], y, mergedWidth, rowHeight);
    drawCellBorder(colX[3], y, colWidths[3], rowHeight);
    page.drawText(totalLabel, {
      x: colX[0] + 5,
      y: y - 14,
      size: 12,
      font: fontBold,
    });
    page.drawText(totalVal, {
      x: colX[3] + 5,
      y: y - 14,
      size: 12,
      font: fontBold,
    });

    y -= 40;
    y = drawCenteredText(".........................", y);
    y -= 10;
    y = drawCenteredText(
      `Son: ${facturacion.pedido?.total.toFixed(2)} Bolivianos`,
      y
    );

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);

    // Abrir el PDF en una nueva pestaña y lanzar impresión
    const newWindow = window.open(blobUrl);
    if (newWindow) {
      newWindow.onload = () => {
        newWindow.focus();
        newWindow.print(); // Mostrará la vista de impresión
      };
    } else {
      alert(
        "El navegador bloqueó la apertura de una nueva pestaña. Permite pop-ups para continuar."
      );
    }
  };

  const ImprimirFactura = async () => {
    const facturacion = factura;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const { width, height } = page.getSize();

    const drawCenteredText = (text, yOffset, isBold = false) => {
      const currentFont = isBold ? fontBold : font;
      const textWidth = currentFont.widthOfTextAtSize(text, 12);
      page.drawText(text, {
        x: (page.getWidth() - textWidth) / 2,
        y: yOffset,
        size: 12,
        font: currentFont,
        color: rgb(0, 0, 0),
      });
      return yOffset - 15;
    };

    const drawLabelValue = (label, value, yOffset) => {
      const labelWidth = fontBold.widthOfTextAtSize(label, 12);
      const valueWidth = font.widthOfTextAtSize(value, 12);
      const totalWidth = labelWidth + 5 + valueWidth;

      const x = (page.getWidth() - totalWidth) / 2;

      page.drawText(label, {
        x,
        y: yOffset,
        size: 12,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      page.drawText(value, {
        x: x + labelWidth + 5,
        y: yOffset,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });

      return yOffset - 15;
    };

    let y = height - 30;

    y = drawCenteredText("FACTURA", y, true);
    y = drawCenteredText("CON DERECHO A CRÉDITO FISCAL", y, true);
    y -= 15; // espacio adicional si deseas

    y = drawCenteredText("LOS ULTIMOS", y, true);
    y = drawCenteredText("UPDS - TARIJA", y, true);
    y = drawCenteredText("AVENIDA LOS SAUCES", y);
    y = drawCenteredText("ESQUINA FABIÁN RUIZ", y);
    y = drawCenteredText("ZONA/BARRIO: ", y);
    y = drawCenteredText("Tarija - Bolivia", y);
    y = drawCenteredText(".........................", y);
    y -= 10;
    y = drawCenteredText("FACTURA N.", y, true);
    y = drawCenteredText(facturacion.id, y);
    y = drawCenteredText(".........................", y);
    y -= 10;
    y = drawLabelValue(
      "Cliente:",
      facturacion.auth?.displayName || "No disponible",
      y
    );
    y = drawLabelValue("Correo:", facturacion.auth?.email, y);
    y = drawLabelValue("Nombre:", facturacion.direccion?.nombre, y);
    y = drawLabelValue("Apellido:", facturacion.direccion?.apellido, y);
    y = drawLabelValue("Ciudad:", facturacion.direccion?.ciudad, y);
    y = drawLabelValue("Dirección:", facturacion.direccion?.direccion, y);
    y = drawLabelValue("Método de pago:", facturacion.metodo, y);
    y -= 10;
    y = drawCenteredText("DETALLE", y);

    const colWidths = [200, 60, 70, 80];
    const totalTableWidth = colWidths.reduce((a, b) => a + b, 0);
    const startX = (page.getWidth() - totalTableWidth) / 2;
    const colX = [
      startX,
      startX + colWidths[0],
      startX + colWidths[0] + colWidths[1],
      startX + colWidths[0] + colWidths[1] + colWidths[2],
    ];
    const rowHeight = 20;

    const drawCellBorder = (x, y, width, height) => {
      page.drawRectangle({
        x,
        y: y - height,
        width,
        height,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    };

    // Dibujar encabezado
    const colTitles = ["Descripción.", "Cant", "P. Unit", "Subtotal"];
    colTitles.forEach((title, i) => {
      drawCellBorder(colX[i], y, colWidths[i], rowHeight);
      page.drawText(title, {
        x: colX[i] + 5,
        y: y - 14,
        size: 12,
        font: fontBold,
      });
    });
    y -= rowHeight;

    // Dibujar filas de datos con bordes
    pedido.carrito.forEach((item) => {
      const precioI = item.precioOferta ? item.precioOferta : item.precio;
      const subtotal = precioI * item.cantidad;
      const precioF = parseFloat(precioI).toFixed(2);
      const valores = [
        item.nombre,
        `${item.cantidad}`,
        `${precioF}`,
        `${subtotal.toFixed(2)}`,
      ];

      valores.forEach((val, i) => {
        drawCellBorder(colX[i], y, colWidths[i], rowHeight);
        page.drawText(val, {
          x: colX[i] + 5,
          y: y - 14,
          size: 12,
          font,
        });
      });

      y -= rowHeight;
    });

    // Dibujar fila Subtotal
    const subtotalLabel = "Subtotal Bs:";
    const subtotalVal = `${pedido.subTotal.toFixed(2)}`;

    // Unir 3 columnas (Nombre, Cantidad, P.Unit)
    const mergedWidth = colWidths[0] + colWidths[1] + colWidths[2];
    drawCellBorder(colX[0], y, mergedWidth, rowHeight);
    drawCellBorder(colX[3], y, colWidths[3], rowHeight);
    page.drawText(subtotalLabel, {
      x: colX[0] + 5,
      y: y - 14,
      size: 12,
      font,
    });
    page.drawText(subtotalVal, {
      x: colX[3] + 5,
      y: y - 14,
      size: 12,
      font,
    });
    y -= rowHeight;

    // Dibujar fila Subtotal
    const subtotalLabel1 = "Impuesto IVA 18%:";
    const subtotalVal1 = `${(pedido.subTotal * 0.18).toFixed(2)}`;

    // Unir 3 columnas (Nombre, Cantidad, P.Unit)
    const mergedWidth1 = colWidths[0] + colWidths[1] + colWidths[2];
    drawCellBorder(colX[0], y, mergedWidth1, rowHeight);
    drawCellBorder(colX[3], y, colWidths[3], rowHeight);
    page.drawText(subtotalLabel1, {
      x: colX[0] + 5,
      y: y - 14,
      size: 12,
      font,
    });
    page.drawText(subtotalVal1, {
      x: colX[3] + 5,
      y: y - 14,
      size: 12,
      font,
    });
    y -= rowHeight;

    // Dibujar fila Total (en negrita)
    const totalLabel = "Total Bs:";
    const totalVal = `${pedido.total.toFixed(2)}`;

    drawCellBorder(colX[0], y, mergedWidth, rowHeight);
    drawCellBorder(colX[3], y, colWidths[3], rowHeight);
    page.drawText(totalLabel, {
      x: colX[0] + 5,
      y: y - 14,
      size: 12,
      font: fontBold,
    });
    page.drawText(totalVal, {
      x: colX[3] + 5,
      y: y - 14,
      size: 12,
      font: fontBold,
    });

    y -= 40;
    y = drawCenteredText(".........................", y);
    y -= 10;
    y = drawCenteredText(
      `Son: ${facturacion.pedido?.total.toFixed(2)} Bolivianos`,
      y
    );

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);

    // Abrir el PDF en una nueva pestaña y lanzar impresión
    const newWindow = window.open(blobUrl);
    if (newWindow) {
      newWindow.onload = () => {
        newWindow.focus();
        newWindow.print(); // Mostrará la vista de impresión
      };
    } else {
      alert(
        "El navegador bloqueó la apertura de una nueva pestaña. Permite pop-ups para continuar."
      );
    }
  };

  return (
    <>
      {pedido.estado === "pendiente" && pedido.clientUid === user.uid ? (
        <>
          <Modal
            show={show}
            onHide={handleClose}
            fullscreen={"sm-down"}
            backdrop="static"
            keyboard={false}
            centered
            scrollable
          >
            <Modal.Header className="pb-0 border-0" closeButton>
              <Modal.Title>Nueva dirección de envío</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-0">
              <div>
                <span className="small text-muted">
                  Añade una nueva dirección de envío para la entrega de tu
                  pedido.
                </span>
                <Form id="direccionN" onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={direccionN.nombre}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      name="apellido"
                      value={direccionN.apellido}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Ciudad</Form.Label>
                    <Form.Control
                      type="text"
                      name="ciudad"
                      value={direccionN.ciudad}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      type="text"
                      name="direccion"
                      value={direccionN.direccion}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Código Postal</Form.Label>
                    <Form.Control
                      type="text"
                      name="codigoPostal"
                      value={direccionN.codigoPostal}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="tel"
                      name="telefono"
                      value={direccionN.telefono}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Usar como dirección predeterminada"
                      name="predeterminado"
                      checked={direccionN.predeterminado}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Form>
              </div>
            </Modal.Body>
            <Modal.Footer className="pt-0 border-0">
              <Button variant="outline-primary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" form="direccionN">
                Guardar dirección
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={showE}
            onHide={handleCloseE}
            fullscreen={"sm-down"}
            backdrop="static"
            keyboard={false}
            centered
            scrollable
          >
            <Modal.Header className="pb-0 border-0" closeButton>
              <Modal.Title>Editar dirección de envío</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-0">
              <div>
                <span className="small text-muted">
                  Edita la dirección del envío para la entrega de tu pedido.
                </span>
                <Form id="direccionE" onSubmit={handleSubmitDireccion}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={direccionE.nombre}
                      onChange={handleChangeE}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      name="apellido"
                      value={direccionE.apellido}
                      onChange={handleChangeE}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Ciudad</Form.Label>
                    <Form.Control
                      type="text"
                      name="ciudad"
                      value={direccionE.ciudad}
                      onChange={handleChangeE}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      type="text"
                      name="direccion"
                      value={direccionE.direccion}
                      onChange={handleChangeE}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Código Postal</Form.Label>
                    <Form.Control
                      type="text"
                      name="codigoPostal"
                      value={direccionE.codigoPostal}
                      onChange={handleChangeE}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="tel"
                      name="telefono"
                      value={direccionE.telefono}
                      onChange={handleChangeE}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Usar como dirección predeterminada"
                      name="predeterminado"
                      checked={direccionE.predeterminado}
                      onChange={handleChangeE}
                    />
                  </Form.Group>
                </Form>
              </div>
            </Modal.Body>
            <Modal.Footer className="pt-0 border-0">
              <Button variant="outline-primary" onClick={handleCloseE}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" form="direccionE">
                Actualizar dirección
              </Button>
            </Modal.Footer>
          </Modal>
          <div className="container py-4">
            <div className="text-end">
              <CloseButton onClick={() => navigate(-1)} />
            </div>
            <h1 className="fw-bolder mb-5">Verificar pedido</h1>
            <div>
              <Form onSubmit={FinalizarPedido} className="row">
                <div className="col-lg-7 col-md-12">
                  <Accordion activeKey={activeKey}>
                    <Accordion.Item eventKey="0" className="border-0">
                      <Accordion.Header onClick={() => handleToggle("0")}>
                        <div className="w-100 d-flex justify-content-between align-items-center bg-body text-body py-2">
                          <div className="d-flex">
                            <PlaceOutlinedIcon fontSize="large" />
                            <h3>Añadir dirección de entrega</h3>
                          </div>
                          <Button
                            variant="outline-primary btn-sm"
                            onClick={handleShow}
                          >
                            Agregar una nueva dirección
                          </Button>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="p-0">
                        <div className="row">
                          {direcciones.map((e, i) => (
                            <div className="mb-4 col-lg-6 col-12" key={i}>
                              <Card>
                                <Card.Body>
                                  <Form.Check
                                    type="radio"
                                    label={e.direccion}
                                    name="direccionSeleccionada"
                                    value={e.id}
                                    onChange={() => setDireccion(e)}
                                    checked={direccion.id === e.id}
                                  />
                                  <div className="ms-3">
                                    <span className="row">
                                      {e.nombre} {e.apellido}
                                    </span>
                                    <span className="row">{e.direccion}</span>
                                    <span className="row">
                                      {e.ciudad} - {e.telefono}
                                    </span>
                                    {e.predeterminado ? (
                                      <p className="text-success mb-1">
                                        Dirección predeterminada
                                      </p>
                                    ) : (
                                      <p className="text-danger mb-1">
                                        Dirección no predeterminada
                                      </p>
                                    )}
                                    <div className="d-flex gap-5">
                                      <Button
                                        variant="outline-success btn-sm fw-bolder"
                                        onClick={() => handleDireccion(e)}
                                      >
                                        Editar
                                      </Button>
                                      <Button
                                        variant="outline-danger btn-sm fw-bolder"
                                        onClick={() => eliminarItem(e.id)}
                                      >
                                        Eliminar
                                      </Button>
                                    </div>
                                  </div>
                                </Card.Body>
                              </Card>
                            </div>
                          ))}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" className="border-0">
                      <Accordion.Header onClick={() => handleToggle("1")}>
                        <div className="w-100 bg-body text-body border-top border-3 py-2">
                          <div className="d-flex">
                            <CreditCardIcon fontSize="large" />
                            <h3 className="ms-1">Método de pago</h3>
                          </div>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="p-0">
                        {/* Tarjeta */}
                        <Card className="mb-3">
                          <Card.Body>
                            <Form.Check
                              type="radio"
                              id="tarjeta"
                              name="metodoPago"
                              label="Tarjeta de crédito/débito"
                              value="tarjeta"
                              checked={metodo === "tarjeta"}
                              onChange={handleSelect}
                            />
                            <small className="text-muted ms-4">
                              Transferencias seguras a través de su cuenta
                              bancaria. Aceptamos Mastercard, Visa, etc.
                            </small>
                            {metodo === "tarjeta" && (
                              <div className="mt-3 ms-4">
                                <Form.Group className="mb-2">
                                  <Form.Label>Número de tarjeta</Form.Label>
                                  <Form.Control
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                  />
                                </Form.Group>
                                <Row>
                                  <Col>
                                    <Form.Group className="mb-2">
                                      <Form.Label>
                                        Nombre en la tarjeta
                                      </Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="Ingrese su nombre"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col>
                                    <Form.Group className="mb-2">
                                      <Form.Label>
                                        Fecha de caducidad
                                      </Form.Label>
                                      <Form.Control
                                        type="month"
                                        min="2025-05"
                                      />
                                    </Form.Group>
                                  </Col>
                                  <Col>
                                    <Form.Group className="mb-2">
                                      <Form.Label>Código CVV</Form.Label>
                                      <Form.Control
                                        type="text"
                                        placeholder="xxx"
                                        maxLength={4}
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                              </div>
                            )}
                          </Card.Body>
                        </Card>

                        {/* Payoneer */}
                        <Card className="mb-3">
                          <Card.Body>
                            <Form.Check
                              type="radio"
                              id="qr"
                              name="metodoPago"
                              label="Pagar con Qr"
                              value="qr"
                              checked={metodo === "qr"}
                              onChange={handleSelect}
                            />
                            <small className="text-muted ms-4">
                              Pago por QR, debes enviar el comprobante del pago
                              para que sea aceptado.
                            </small>
                            {metodo === "qr" && (
                              <>
                                <div className="w-100 p-3">
                                  <img
                                    src="/img/qr.jpeg"
                                    alt=""
                                    className="rounded rounded-4 p-0 border border-black"
                                  />
                                </div>
                                <Form.Group className="mb-2">
                                  <Form.Label>Comprobante</Form.Label>
                                  <Form.Control type="file" accept="image" />
                                </Form.Group>
                              </>
                            )}
                          </Card.Body>
                        </Card>

                        {/* Contra reembolso */}
                        <Card className="mb-3">
                          <Card.Body>
                            <Form.Check
                              type="radio"
                              id="reembolso"
                              name="metodoPago"
                              label="Pago contra reembolso"
                              value="reembolso"
                              checked={metodo === "reembolso"}
                              onChange={handleSelect}
                            />
                            <small className="text-muted ms-4">
                              Pague en efectivo cuando se entregue su pedido.
                            </small>
                          </Card.Body>
                        </Card>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
                <div className="col-lg-4 col-md-12 col-12 offset-lg-1">
                  <div className="mt-4 mt-lg-0">
                    <div className="shadow-sm card">
                      <h5 className="px-4 py-3 bg-transparent mb-0">
                        Detalles del pedido
                      </h5>
                      <ul className="list-group list-group-flush">
                        {pedido?.carrito?.map((e, i) => (
                          <li key={i} className="px-4 py-3 list-group-item">
                            <div className="align-items-center row">
                              <div className="col-md-2 col-2">
                                <img src={e.url} alt="" height={40} />
                              </div>
                              <div className="col-md-5 col-5">
                                <h6 className="mb-0">{e.nombre}</h6>
                                <span className="small text-muted">
                                  {e.peso}
                                  {e.unidad}
                                </span>
                              </div>
                              <div className="text-center text-muted col-md-2 col-2">
                                <span>{e.cantidad}</span>
                              </div>
                              <div className="text-lg-end text-start text-md-end col-md-3 col-3">
                                <span className="fw-bolder">
                                  {e.precioOferta ? e.precioOferta : e.precio}{" "}
                                  Bs
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                        <li className="px-4 py-3 list-group-item">
                          <div className="d-flex align-items-center justify-content-between   mb-2">
                            <div className="">Subtotal del artículo</div>
                            <div className="fw-bolder">
                              {pedido.subTotal.toFixed(2)} Bs
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between   mb-2">
                            <div className="">Impuesto IVA 18%</div>
                            <div className="fw-bolder">
                              {(pedido.subTotal * 0.18).toFixed(2)} Bs
                            </div>
                          </div>
                        </li>
                        <div className="px-4 py-3 list-group-item">
                          <div className="d-flex align-items-center justify-content-between mb-2 fw-bold">
                            <div className="">Gran total</div>
                            <div className="fw-bolder">
                              {pedido.total.toFixed(2)} Bs
                            </div>
                          </div>
                        </div>
                      </ul>
                    </div>
                  </div>
                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary my-3 fw-bolder btn-lg"
                      disabled={direccion.length === 0 || !metodo}
                    >
                      Finalizar pedido
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="container py-4">
            <div className="text-end">
              <CloseButton onClick={() => navigate(-1)} />
            </div>
            <h1>Pedido</h1>
            <div className="row">
              <div className="col-lg-6 col-md-12 col-12">
                <div className="mt-4 mt-lg-0">
                  <div className="shadow-sm card">
                    <h5 className="px-4 py-3 bg-transparent mb-0">
                      Detalles del usuario
                    </h5>
                    <ul className="list-group list-group-flush">
                      <li className="px-4 py-3 list-group-item">
                        <div className="d-flex align-items-center justify-content-between   mb-2">
                          <div className="">Usuario</div>
                          <div className="fw-bolder">{usuario.displayName}</div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between   mb-2">
                          <div className="">Email</div>
                          <div className="fw-bolder">{usuario.email}</div>
                        </div>
                      </li>
                      <div className="px-4 py-3 list-group-item">
                        <div className="d-flex align-items-center justify-content-between mb-2 fw-bold">
                          <div className="">Estado</div>
                          <div className="fw-bolder">{pedido.estado}</div>
                        </div>
                      </div>
                    </ul>
                  </div>
                </div>

                {pedido.estado === "completado" && (
                  <div className="mt-4 mt-lg-0 pt-4">
                    <div className="shadow-sm card">
                      <h5 className="px-4 py-3 bg-transparent mb-0">
                        Detalles de entrega
                      </h5>
                      <ul className="list-group list-group-flush">
                        <li className="px-4 py-3 list-group-item">
                          <div className="d-flex align-items-center justify-content-between   mb-2">
                            <div className="">Ciudad</div>
                            <div className="fw-bolder">
                              {factura.direccion?.ciudad}
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between   mb-2">
                            <div className="">Dirección</div>
                            <div className="fw-bolder">
                              {factura.direccion?.direccion}
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between   mb-2">
                            <div className="">Metodo de pago</div>
                            <div className="fw-bolder">{factura.metodo}</div>
                          </div>
                        </li>
                        <div className="px-4 py-3 list-group-item">
                          <div className="d-flex align-items-center justify-content-between mb-2 fw-bold">
                            <div className="">Entregar a</div>
                            <div className="fw-bolder">
                              {factura.direccion?.nombre}{" "}
                              {factura.direccion?.apellido}
                            </div>
                          </div>
                        </div>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-lg-6 col-md-12 col-12">
                <div className="mt-4 mt-lg-0">
                  <div className="shadow-sm card">
                    <h5 className="px-4 py-3 bg-transparent mb-0">
                      Detalles del pedido
                    </h5>
                    <ul className="list-group list-group-flush">
                      {pedido?.carrito?.map((e, i) => (
                        <li key={i} className="px-4 py-3 list-group-item">
                          <div className="align-items-center row">
                            <div className="col-md-2 col-2">
                              <img src={e.url} alt="" height={40} />
                            </div>
                            <div className="col-md-5 col-5">
                              <h6 className="mb-0">{e.nombre}</h6>
                              <span className="small text-muted">
                                {e.peso}
                                {e.unidad}
                              </span>
                            </div>
                            <div className="text-center text-muted col-md-2 col-2">
                              <span>{e.cantidad}</span>
                            </div>
                            <div className="text-lg-end text-start text-md-end col-md-3 col-3">
                              <span className="fw-bolder">
                                {e.precioOferta ? e.precioOferta : e.precio} Bs
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                      <li className="px-4 py-3 list-group-item">
                        <div className="d-flex align-items-center justify-content-between   mb-2">
                          <div className="">Subtotal del artículo</div>
                          <div className="fw-bolder">
                            {pedido.subTotal.toFixed(2)} Bs
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between   mb-2">
                          <div className="">Impuesto IVA 18%</div>
                          <div className="fw-bolder">
                            {(pedido.subTotal * 0.18).toFixed(2)} Bs
                          </div>
                        </div>
                      </li>
                      <div className="px-4 py-3 list-group-item">
                        <div className="d-flex align-items-center justify-content-between mb-2 fw-bold">
                          <div className="">Gran total</div>
                          <div className="fw-bolder">
                            {pedido.total.toFixed(2)} Bs
                          </div>
                        </div>
                      </div>
                    </ul>
                  </div>
                  {pedido.estado === "completado" && (
                    <div className="d-grid">
                      <Button
                        type="submit"
                        variant="primary my-3 fw-bolder btn-lg"
                        onClick={ImprimirFactura}
                      >
                        Imprimir factura
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
