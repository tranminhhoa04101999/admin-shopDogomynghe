import { Fragment, useEffect, useState } from "react";
import HeaderMain from "./header/HeaderMain";
import "./Layout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faProductHunt } from "@fortawesome/free-brands-svg-icons";
import { NavLink } from "react-router-dom";

const Layout = (props) => {
  return (
    <Fragment>
      <HeaderMain />
      <div className="wrapper">
        <div className="main-nav">
          <NavLink to="/dashboard" className="main-nav-item">
            <FontAwesomeIcon icon={faChartLine} className="main-nav__icon" />
            Dashboard
          </NavLink>
          <NavLink to="/products" className="main-nav-item">
            <FontAwesomeIcon icon={faProductHunt} className="main-nav__icon" />
            Products
          </NavLink>
        </div>
        <div className="main">{props.children}</div>
      </div>
    </Fragment>
  );
};

export default Layout;
