import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import React from 'react';
import './NavLinkCustom.css';

const NavLinkCustom = (props) => {
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) =>
        isActive ? 'nav-custom nav-custom--active' : 'nav-custom'
      }
    >
      <FontAwesomeIcon icon={props.iconName} className="nav-custom__icon" />
      {props.title}
    </NavLink>
  );
};

export default NavLinkCustom;
