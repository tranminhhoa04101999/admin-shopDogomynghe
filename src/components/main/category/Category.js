import React from 'react';
import './Category.css';
import { faPlus, faTabletAlt } from '@fortawesome/free-solid-svg-icons';
import NavLinkCustom from '../../base/NavLinkCustom';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Category = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('infoAccountLogined'));
    if (data === null || data === undefined) {
      navigate('/authenticate');
    } else {
      navigate('/category/showcategory');
    }
  }, []);
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
