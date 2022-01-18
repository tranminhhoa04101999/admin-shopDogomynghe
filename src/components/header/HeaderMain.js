import "./HeaderMain.css";
import { faUser, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HeaderMain = (props) => {
  return (
    <header className="headerMain">
      <div className="headerMain__title">TMH Shop Quản Lý</div>
      <div className="headerMain_user-wrap">
        <FontAwesomeIcon icon={faUser} className="headerMain_user-icon" />
        <FontAwesomeIcon icon={faCaretDown} className="headerMain_user-icon" />
      </div>
    </header>
  );
};

export default HeaderMain;
