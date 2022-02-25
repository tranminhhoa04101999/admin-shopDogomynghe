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
  return (
    <header className="headerMain">
      <div className="headerMain__title">TMH Shop Quản Lý</div>
      {dataInfo === null || dataInfo === undefined ? (
        ''
      ) : (
        <div className="headerMain_user-wrap" onClick={() => infoHandler()}>
          <FontAwesomeIcon icon={faUser} className="headerMain_user-icon" />
          <FontAwesomeIcon icon={faCaretDown} className="headerMain_user-icon" />
        </div>
      )}
    </header>
  );
};

export default HeaderMain;
