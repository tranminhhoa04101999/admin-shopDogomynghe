import React from 'react';
import './Account.css';
import NavLinkCustom from '../../base/NavLinkCustom';
import { faPlus, faTabletAlt } from '@fortawesome/free-solid-svg-icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Account = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/account/showaccount');
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
