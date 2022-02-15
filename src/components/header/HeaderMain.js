import "./HeaderMain.css";
import { faUser, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HeaderMain = (props) => {
  const data = JSON.parse(localStorage.getItem("infoAccountLogined"));
  return (
    <header className="headerMain">
      <div className="headerMain__title">TMH Shop Quản Lý</div>
      {data === null || data === undefined ? (
        ""
      ) : (
        <div className="headerMain_user-wrap">
          <FontAwesomeIcon icon={faUser} className="headerMain_user-icon" />
          <FontAwesomeIcon icon={faCaretDown} className="headerMain_user-icon" />
        </div>
      )}
    </header>
  );
};

export default HeaderMain;
