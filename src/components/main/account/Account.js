import React from 'react';
import './Account.css';
import NavLinkCustom from '../../base/NavLinkCustom';
import { faPlus, faTabletAlt } from '@fortawesome/free-solid-svg-icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Account = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('infoAccountLogined'));
    if (data === null || data === undefined) {
      navigate('/authenticate');
    } else {
      if (data.role.idRole === 2) {
        navigate('/product');
      } else {
        navigate('/account/showaccount');
      }
    }
  }, []);
  return (
    <div className="wrap-account">
      <div className="header-account">
        <div className="header-account__btn">
          <NavLinkCustom to="showaccount" title="Hiển thị" iconName={faTabletAlt} />
        </div>
        <div className="header-account__btn">
          <NavLinkCustom to="addaccount" title="thêm" iconName={faPlus} />
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Account;
