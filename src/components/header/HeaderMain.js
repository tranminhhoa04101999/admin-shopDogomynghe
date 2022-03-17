import './HeaderMain.css';
import { faUser, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const HeaderMain = (props) => {
  const navigate = useNavigate();

  const dataInfo = JSON.parse(localStorage.getItem('infoAccountLogined'));
  const infoHandler = () => {
    navigate('/infomation');
  };

  const logoutHandler = () => {
    localStorage.removeItem('infoAccountLogined');
    window.location.reload(false);

    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 3000);
  };

  return (
    <header className="headerMain">
      <div className="headerMain__title">TMH Shop Quản Lý</div>
      {dataInfo === null || dataInfo === undefined ? (
        ''
      ) : (
        <div className="headerMain_user-wrap">
          <FontAwesomeIcon icon={faUser} className="headerMain_user-icon" />
          <FontAwesomeIcon icon={faCaretDown} className="headerMain_user-icon" />
          <ul className="dropdown-headerMain_user">
            <li onClick={() => infoHandler()}>Thông tin</li>
            <li onClick={() => logoutHandler()}>Đăng xuất</li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default HeaderMain;
