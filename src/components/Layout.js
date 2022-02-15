import HeaderMain from "./header/HeaderMain";
import "./Layout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { faProductHunt } from "@fortawesome/free-brands-svg-icons";
import { NavLink } from "react-router-dom";

const Layout = (props) => {
  const data = JSON.parse(localStorage.getItem("infoAccountLogined"));

  return (
    <div>
      <HeaderMain />
      <div className="wrapper">
        {data === undefined || data === null ? (
          ""
        ) : (
          <div className="main-nav">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "main-nav-item main-nav-item--active" : "main-nav-item"
              }
            >
              <FontAwesomeIcon icon={faChartLine} className="main-nav__icon" />
              Dashboard
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                isActive ? "main-nav-item main-nav-item--active" : "main-nav-item"
              }
            >
              <FontAwesomeIcon icon={faChartLine} className="main-nav__icon" />
              Users
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? "main-nav-item main-nav-item--active" : "main-nav-item"
              }
            >
              <FontAwesomeIcon icon={faProductHunt} className="main-nav__icon" />
              Products
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive ? "main-nav-item main-nav-item--active" : "main-nav-item"
              }
            >
              <FontAwesomeIcon icon={faProductHunt} className="main-nav__icon" />
              Orders
            </NavLink>
          </div>
        )}
        <div className="main">{props.children}</div>
      </div>
    </div>
  );
};

export default Layout;
