import React, { useEffect } from 'react';
import './ImportProduct.css';
import { faPlus, faTabletAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Outlet } from 'react-router-dom';
import NavLinkCustom from '../../base/NavLinkCustom';

const ImportProduct = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('infoAccountLogined'));
    if (data === null || data === undefined) {
      navigate('/authenticate');
    } else {
      navigate('/importproduct/showimport');
    }
  }, []);
  return (
    <div className="wrap-importproduct">
      <div className="header-importproduct">
        <div className="header-importproduct__btn">
          <NavLinkCustom to="showimport" title="Hiển thị" iconName={faTabletAlt} />
        </div>
        <div className="header-importproduct__btn">
          <NavLinkCustom to="addimport" title="thêm" iconName={faPlus} />
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default ImportProduct;
