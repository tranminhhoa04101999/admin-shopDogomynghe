import React from 'react';
import './Infomation.css';
import NavLinkCustom from '../../base/NavLinkCustom';
import { faPlus, faTabletAlt, faKey } from '@fortawesome/free-solid-svg-icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Infomation = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('infoAccountLogined'));
    if (data === null || data === undefined) {
      navigate('/authenticate');
    } else {
      navigate('/infomation/showInfomation');
    }
  }, []);

  return (
    <div className="wrap-account">
      <div className="header-account">
        <div className="header-account__btn">
          <NavLinkCustom to="showInfomation" title="Thông tin" iconName={faTabletAlt} />
        </div>
        <div className="header-account__btn">
          <NavLinkCustom to="changePassword" title="Đổi mật khẩu" iconName={faKey} />
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Infomation;
