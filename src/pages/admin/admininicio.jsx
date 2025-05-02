import React from "react";
import { NavLink } from "react-router-dom";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import { AdminNav } from "../../scripts/components/adminNav";
import { AdminInicioUI } from "../../scripts/ui/productor/adminInicioUI";

export function Adminicio() {
  return (
    <>
      <div className="container-md">
        <div className="row">
          <AdminNav />
          <div className="col-lg-9 col-md-8 col-12">
            <div className="py-5 p-md-6 p-lg-10">
              <AdminInicioUI />
            </div>
          </div>
        </div>
      </div>
      <div
        className="card border-0 rounded-4 bg-light"
        style={{
          backgroundImage: 'url("/img/slider-image-1.webp")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >

      </div>

    </>
  );
}
