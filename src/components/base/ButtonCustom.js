import React from 'react';
import './ButtonCustom.css';

const ButtonCustom = (props) => {
  return (
    <button
      style={props.style}
      className="btnCustom"
      onClick={props.onClick}
      onMouseEnter={props.OnMouseEnter}
    >
      {props.children}
    </button>
  );
};

export default ButtonCustom;
