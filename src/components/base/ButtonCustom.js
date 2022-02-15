import React from "react";
import "./ButtonCustom.css";

const ButtonCustom = (props) => {
  return (
    <button style={props.style} className="btnCustom" onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default ButtonCustom;
