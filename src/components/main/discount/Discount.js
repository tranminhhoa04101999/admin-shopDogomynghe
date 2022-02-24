import React from 'react';
import './Discount.css';
import { faPlus, faTabletAlt } from '@fortawesome/free-solid-svg-icons';
import NavLinkCustom from '../../base/NavLinkCustom';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Discount = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/discount/showdiscount');
  }, []);
  return (
    <div className="wrap-discount">
      <div className="header-discount">
        <div className="header-discount__btn">
          <NavLinkCustom to="showdiscount" title="Hiển thị" iconName={faTabletAlt} />
        </div>
        <div className="header-discount__btn">
          <NavLinkCustom to="adddiscount" title="thêm" iconName={faPlus} />
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Discount;
