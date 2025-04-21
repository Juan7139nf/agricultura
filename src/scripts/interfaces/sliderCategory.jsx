import React from "react";
import { NavLink } from "react-router-dom";
import Slider from "react-slick";

const datos = [
  {
    name: "Vegetales",
    img: "/svg/vegetables.svg",
    url: "/filtrar/category/vegetales",
  },
  {
    name: "Frutas",
    img: "/svg/fruit.svg",
    url: "/filtrar/category/frutas",
  },
  {
    name: "Lácteos",
    img: "/svg/dairy.svg",
    url: "/filtrar/category/lacteos",
  },
  {
    name: "Panadería",
    img: "/svg/bakery.svg",
    url: "/filtrar/category/panaderia",
  },
  {
    name: "Aperitivos",
    img: "/svg/snacks.svg",
    url: "/filtrar/category/aperitivos",
  },
  {
    name: "Materia prima",
    img: "/svg/coffee.svg",
    url: "/filtrar/category/materiaprima",
  },
];

function Slider_Category() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 3,
  };
  return (
    <div className="container-sm slider-button-top-end">
      <div className="">
        <span className="fs-4 fw-bolder">Buscar por categoria</span>
      </div>
      <div className="slider-container">
        <Slider {...settings}>
          {datos.map((e, i) => (
            <div key={i} className="p-2">
              <div className="card-link">
                <div className="mb-3 card-lift card">
                  <div className="text-center py-6 card-body">
                    <div className="my-4 text-body-emphasis">
                      <img src={e.img} alt="" className="mx-auto text-body-secondary" />
                    </div>
                    <NavLink
                      className="text-decoration-none text-inherit text-body-emphasis"
                      to={e.url}
                    >
                      {e.name}
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Slider_Category;
