import React from 'react';
import './Category.css';
import { faPlus, faTabletAlt } from '@fortawesome/free-solid-svg-icons';
import NavLinkCustom from '../../base/NavLinkCustom';
import { Outlet } from 'react-router-dom';

const Category = () => {
  return (
    <div className="wrap-category">
      <div className="header-category">
        <div className="header-category__btn">
          <NavLinkCustom to="showcategory" title="Hiển thị" iconName={faTabletAlt} />
        </div>
        <div className="header-category__btn">
          <NavLinkCustom to="addcategory" title="thêm" iconName={faPlus} />
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Category;
