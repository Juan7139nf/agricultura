import React from "react";
import Slider_Category from "../scripts/interfaces/sliderCategory";
import Inicio_Banner from "../scripts/ui/inicioBanner";
import ProductDestacado from "../scripts/interfaces/productDestacado";
import VerEvento from "./cliente/verevento";

const Inicio = () => {
  return (
    <>
      <Inicio_Banner />
      <Slider_Category />
      <ProductDestacado />
      <VerEvento/>
    </>
  );
};

export default Inicio;
