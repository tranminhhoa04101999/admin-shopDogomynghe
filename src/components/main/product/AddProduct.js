import React from 'react';
import InputCustom from '../../base/InputCustom';
import './AddProduct.css';
import { useState } from 'react';
import { Switch } from 'antd';
import ButtonCustom from '../../base/ButtonCustom';
import { LINKCONECT_BASE } from '../../../App';
import { notification } from 'antd';
import { useEffect } from 'react';
import ButtonUploadImg from '../../base/ButtonUploadImg';

const AddProduct = () => {
  const [reset, setReset] = useState('');
  const date = new Date();
  const dateNow =
    date.getFullYear().toString() +
    '-' +
    date.getMonth().toString() +
    '-' +
    date.getDay().toString();
  const [dataProd, setDataProd] = useState({
    nameProduct: '',
    price: 0,
    color: '',
    descProduct: '',
    quantity: 0,
    addDate: dateNow,
    isActive: 1,
  });

  const openNotificationWithIcon = (props) => {
    notification[props.type]({
      message: props.message,
      description: props.desc,
    });
  };

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
    if (checked) {
      setDataProd((prevData) => ({ ...prevData, isActive: 1 }));
    } else {
      setDataProd((prevData) => ({ ...prevData, isActive: 0 }));
    }
  };

  const btnSubmitHandler = () => {
    if (dataProd.nameProduct === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Vui lòng nhập tên sản phẩm',
      });
      return;
    } else if (dataProd.color === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Vui lòng nhập màu sản phẩm',
      });
      return;
    }
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
      .then((response) => response)
      .then((data) => {
        openNotificationWithIcon({
          type: 'success',
          message: 'Thêm mới thành công',
          desc: dataProd.nameProduct,
        });
        // thêm thành công reset input
        setReset('RESET');
      })
      .catch((error) => {
        openNotificationWithIcon({
          type: 'error',
          message: 'Thêm mới thất bại',
          desc: error,
        });
      });
  };

  useEffect(() => {
    setDataProd({
      nameProduct: '',
      price: 0,
      color: '',
      descProduct: '',
      quantity: 0,
      addDate: '2022-02-15',
      isActive: 1,
    });
    setReset('');
  }, [reset]);

  return (
    <div className="wrap-addprod">
      <div className="wrap-addprod__item">
        <InputCustom
          type="text"
          placeholder="Tên sản phẩm"
          onChange={nameProdOnchange}
          value={dataProd.nameProduct}
        />
        <InputCustom
          type="number"
          placeholder="Giá"
          onChange={priceProdOnchange}
          value={dataProd.price}
        />
        <InputCustom
          type="text"
          placeholder="Màu"
          onChange={colorProdOnchange}
          value={dataProd.color}
        />
        <InputCustom
          type="text"
          placeholder="Miêu tả"
          onChange={descProdOnchange}
          value={dataProd.descProduct}
        />
        <InputCustom
          type="number"
          placeholder="Số lượng"
          onChange={quantityProdOnchange}
          value={dataProd.quantity}
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
        <div className="addprod-item__action">
          <ButtonUploadImg />
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
