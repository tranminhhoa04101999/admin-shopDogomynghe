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
  const [activeUpload, setActiveUpload] = useState(0);
  const [idProdMax, setIdProdMax] = useState(0);
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
    addDate: new Date(),
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

  const btnSubmitHandler = async () => {
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
    // them product
    await fetch(LINKCONECT_BASE + '/addproduct', {
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
      })
      .catch((error) => {
        openNotificationWithIcon({
          type: 'error',
          message: 'Thêm mới thất bại',
          desc: error,
        });
      });
    //lấy idproduct mới tạo để upload ảnh

    await fetch('http://localhost:8080/getIdProductMax')
      .then((response) => response.json())
      .then((data) => setIdProdMax(data));
    //sau khi có idProd cho upload ảnh theo id
    setActiveUpload(1);
    //thêm thành công reset input
    setDataProd({
      nameProduct: '',
      price: 0,
      color: '',
      descProduct: '',
      quantity: 0,
      addDate: new Date(),
      isActive: 1,
    });
  };

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
        <div className="addprod-item__action wrapp-btn-upload">
          <ButtonUploadImg activeUpload={activeUpload} idMaxProduct={idProdMax} />
        </div>
        <div className="addprod-item__action">
          <div className="addprod-item__Switch">
            <span>Mở Bán</span>
            <Switch defaultChecked onChange={switchHandler} />
          </div>

          <div className="addprod-item__btn">
            <ButtonCustom
              style={{ backgroundColor: 'var(--color-btn-add)' }}
              onClick={() => btnSubmitHandler()}
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
