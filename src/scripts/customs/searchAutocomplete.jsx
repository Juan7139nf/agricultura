import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { database } from "../../scripts/firebase/firebase"; // ajusta la ruta según corresponda
import useAutocomplete from "@mui/material/useAutocomplete";
import { styled } from "@mui/system";
import { Button, Form, InputGroup } from "react-bootstrap";

const Label = styled("label")({
  display: "block",
});

const Input = styled("input")(({ theme }) => ({
  position: "relative",
  ...theme?.applyStyles?.("dark", {
    backgroundColor: "#000",
    color: "#fff",
  }),
}));

const Listbox = styled("ul")(({ theme }) => ({
  width: "57%",
  maxWidth: "25rem",
  margin: 0,
  padding: 0,
  zIndex: 1,
  position: "absolute",
  listStyle: "none",
  overflow: "auto",
  maxHeight: 200,
  border: "1px solid rgba(0,0,0,.25)",
  "& li.Mui-focused": {
    backgroundColor: "#4a8df6",
    color: "white",
    cursor: "pointer",
  },
  "& li:active": {
    backgroundColor: "#2977f5",
    color: "white",
  },
  ...theme?.applyStyles?.("dark", {
    backgroundColor: "#000",
  }),
}));

export default function SearchAutocomplete() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Cargar productos desde Firebase
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

  // Configuración del autocomplete
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: "autocomplete-productos",
    options: products,
    getOptionLabel: (option) => option.nombre || "Producto sin nombre",
    onChange: (event, value) => {
      if (value && value.id) {
        navigate(`/detalle/${value.id}`);
      }
    },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="mx-auto"
        style={{ maxWidth: "30rem" }}
      >
        <Input
          {...getInputProps()}
          className="form-control"
          placeholder="Buscar productos"
        />
        {groupedOptions.length > 0 ? (
          <Listbox {...getListboxProps()} className="bg-body-tertiary">
            {groupedOptions.map((option, index) => {
              const { key, ...optionProps } = getOptionProps({ option, index });
              return (
                <li key={option.id} {...optionProps}>
                  {option.nombre}
                </li>
              );
            })}
          </Listbox>
        ) : null}
      </div>
    </div>
  );
}
