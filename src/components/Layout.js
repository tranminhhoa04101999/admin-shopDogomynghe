import HeaderMain from './header/HeaderMain';
import './Layout.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faBox,
  faShoppingBag,
  faPercent,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { faProductHunt } from '@fortawesome/free-brands-svg-icons';
import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';

const Layout = (props) => {
  const data = JSON.parse(localStorage.getItem('infoAccountLogined'));

  // console.log('data.role.idRole', data.role.idRole);

  return (
    <div>
      <HeaderMain />
      <div className="wrapper">
        {data === undefined || data === null ? (
          ''
        ) : (
          <div className="main-nav">
            {data.role.idRole !== 2 && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? 'main-nav-item main-nav-item--active' : 'main-nav-item'
                }
              >
                <FontAwesomeIcon icon={faChartLine} className="main-nav__icon" />
                Dashboard
              </NavLink>
            )}
            {data.role.idRole !== 2 && (
              <NavLink
                to="/account"
                className={({ isActive }) =>
                  isActive ? 'main-nav-item main-nav-item--active' : 'main-nav-item'
                }
              >
                <FontAwesomeIcon icon={faUser} className="main-nav__icon" />
                Users
              </NavLink>
            )}
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? 'main-nav-item main-nav-item--active' : 'main-nav-item'
              }
            >
              <FontAwesomeIcon icon={faProductHunt} className="main-nav__icon" />
              Products
            </NavLink>
            <NavLink
              to="/category"
              className={({ isActive }) =>
                isActive ? 'main-nav-item main-nav-item--active' : 'main-nav-item'
              }
            >
              <FontAwesomeIcon icon={faBox} className="main-nav__icon" />
              Category
            </NavLink>
            <NavLink
              to="/discount"
              className={({ isActive }) =>
                isActive ? 'main-nav-item main-nav-item--active' : 'main-nav-item'
              }
            >
              <FontAwesomeIcon icon={faPercent} className="main-nav__icon" />
              Discount
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive ? 'main-nav-item main-nav-item--active' : 'main-nav-item'
              }
            >
              <FontAwesomeIcon icon={faShoppingBag} className="main-nav__icon" />
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
