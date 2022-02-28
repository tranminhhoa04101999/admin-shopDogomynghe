import React from 'react';
import './Orders.css';
import { faPlus, faTabletAlt } from '@fortawesome/free-solid-svg-icons';
import NavLinkCustom from '../../base/NavLinkCustom';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Orders = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('infoAccountLogined'));
    if (data === null || data === undefined) {
      navigate('/authenticate');
    } else {
      navigate('/orders/showorders');
    }
  }, []);
  return (
    <div className="wrap-orders">
      <div className="header-orders">
        <div className="header-orders__btn">
          <NavLinkCustom to="showorders" title="Hiển thị" iconName={faTabletAlt} />
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Orders;
