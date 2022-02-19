import React from 'react';
import './InputCustom.css';

const InputCustom = (props) => {
  return (
    <div className="wrap-inputcustom">
      <input
        ref={props.ref}
        value={props.value}
        type={props.type}
        className="inputcustom__input"
        placeholder={props.placeholder}
        onChange={props.onChange}
        min={0}
        disabled={props.disabled}
      />
    </div>
  );
};

export default InputCustom;
