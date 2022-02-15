import React from "react";
import "./InputCustom.css";

const InputCustom = (props) => {
  return (
    <div className="wrap-inputcustom">
      <input
        type={props.type}
        className="inputcustom__input"
        placeholder={props.placeholder}
        onChange={props.onChange}
        min={0}
      />
    </div>
  );
};

export default InputCustom;
