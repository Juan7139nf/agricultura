import React from "react";
import { ProductorNav } from "../../scripts/components/productorNav";
import { ProductorInicioUI } from "../../scripts/ui/productor/productorInicioUI";

export function ProductorInicio() {
  return (
    <>
      <div className="container-md">
        <div className="row">
          <ProductorNav />
          <div className="col-lg-9 col-md-8 col-12">
            <div className="py-5 p-md-6 p-lg-10">
              <ProductorInicioUI />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
