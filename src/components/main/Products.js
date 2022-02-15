import NavLinkCustom from "../base/NavLinkCustom";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

import "./Product.css";
import { Outlet } from "react-router-dom";

const Products = (props) => {
  return (
    <div className="wrap-product">
      <div className="header-product">
        <div className="header-product__btn">
          <NavLinkCustom to="addproduct" title="thêm" iconName={faPlus} />
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Products;
