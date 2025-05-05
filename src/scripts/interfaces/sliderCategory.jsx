import React from "react";
import { NavLink } from "react-router-dom";
import Slider from "react-slick";

const datos = [
  {
    name: "Vegetales",
    img: "/svg/vegetables.svg",
  },
  {
    name: "Frutas",
    img: "/svg/fruit.svg",
  },
  {
    name: "Lácteos",
    img: "/svg/dairy.svg",
  },
  {
    name: "Panadería",
    img: "/svg/bakery.svg",
  },
  {
    name: "Aperitivos",
    img: "/svg/snacks.svg",
  },
  {
    name: "Materia prima",
    img: "/svg/coffee.svg",
  },
];

function Slider_Category() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: false, // Activar autoplay
    autoplaySpeed: 2000, // Intervalo entre slides (en ms)
    slidesToShow: 6,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1200, // Menor a 1200px
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768, // Menor a 768px
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // Menor a 480px (móviles)
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="container-sm slider-button-top-end py-4">
      <div className="py-3">
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
                      <img
                        src={e.img}
                        alt=""
                        className="mx-auto text-body-secondary"
                      />
                    </div>
                    <div className="text-decoration-none text-inherit text-body-emphasis">
                      {e.name}
                    </div>
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
