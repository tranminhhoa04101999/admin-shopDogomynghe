import React from 'react';
import InputCustom from '../base/InputCustom';
import './AddProduct.css';
import { useState } from 'react';

import { Switch } from 'antd';
import ButtonCustom from '../base/ButtonCustom';
import { LINKCONECT_BASE } from '../../App';

const styleButton = {};

const AddProduct = () => {
  const [dataProd, setDataProd] = useState({
    nameProduct: '',
    price: 0,
    color: '',
    descProduct: '',
    quantity: 0,
    addDate: '2022-02-15',
    isActive: 1,
  });

  const nameProdOnchange = (event) => {
    setDataProd((prevData) => ({ ...prevData, nameProduct: event.target.value }));
  };
  const priceProdOnchange = (event) => {
    setDataProd((prevData) => ({ ...prevData, price: event.target.value }));
  };
  const colorProdOnchange = (event) => {
    setDataProd((prevData) => ({ ...prevData, color: event.target.value }));
  };
  const descProdOnchange = (event) => {
    setDataProd((prevData) => ({ ...prevData, descProduct: event.target.value }));
  };
  const quantityProdOnchange = (event) => {
    setDataProd((prevData) => ({ ...prevData, quantity: event.target.value }));
  };
  const switchHandler = (checked) => {
    console.log('sdsa', checked);
    if (checked) {
      setDataProd((prevData) => ({ ...prevData, isActive: 1 }));
    } else {
      setDataProd((prevData) => ({ ...prevData, isActive: 0 }));
    }
  };

  const btnSubmitHandler = () => {
    console.log(dataProd);
    console.log(JSON.stringify(dataProd));
    console.log(LINKCONECT_BASE + '/addproduct');
    fetch(LINKCONECT_BASE + '/addproduct', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        Accepts: '*/*',

        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(dataProd),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:' + data);
      })
      .catch((error) => {
        console.error('Error:' + error);
      });
  };

  return (
    <div className="wrap-addprod">
      <div className="wrap-addprod__item">
        <InputCustom type="text" placeholder="Tên sản phẩm" onChange={nameProdOnchange} />
        <InputCustom type="number" placeholder="Giá" onChange={priceProdOnchange} />
        <InputCustom type="text" placeholder="Màu" onChange={colorProdOnchange} />
        <InputCustom type="text" placeholder="Miêu tả" onChange={descProdOnchange} />
        <InputCustom
          type="number"
          placeholder="Số lượng"
          onChange={quantityProdOnchange}
        />
        <div className="addprod-item__action">
          <div className="addprod-item__Switch">
            <span>Mở Bán</span>
            <Switch defaultChecked onChange={switchHandler} />
          </div>
          <div className="addprod-item__btn">
            <ButtonCustom
              style={{ backgroundColor: 'var(--color-btn-add)' }}
              onClick={btnSubmitHandler}
            >
              Tạo sản phẩm
            </ButtonCustom>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
