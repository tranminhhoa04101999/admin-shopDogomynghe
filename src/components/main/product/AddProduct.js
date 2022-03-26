import React from 'react';
import InputCustom from '../../base/InputCustom';
import './AddProduct.css';
import { useState } from 'react';
import { Switch } from 'antd';
import ButtonCustom from '../../base/ButtonCustom';
import { LINKCONECT_BASE } from '../../../App';
import { notification, Select } from 'antd';
import { useEffect } from 'react';
import ButtonUploadImg from '../../base/ButtonUploadImg';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [activeUpload, setActiveUpload] = useState(0);
  const [idProdMax, setIdProdMax] = useState(0);
  const [dataCategory, setDataCategory] = useState([
    {
      idCategory: 0,
      name: 'deafault',
      desc: null,
      imgURL: 'defaultImage',
      isActive: 1,
    },
  ]);
  const navigate = useNavigate();
  const { Option } = Select;

  const [dataProd, setDataProd] = useState({
    nameProduct: '',
    price: 0,
    color: '',
    descProduct: '',
    quantity: 0,
    addDate: new Date(),
    isActive: 1,
    category: null,
  });

  useEffect(() => {
    //lấy category all
    fetch(`${LINKCONECT_BASE}/allcategory`)
      .then((response) => response.json())
      .then((data) => {
        setDataCategory(data);
        setDataProd((prev) => ({ ...prev, category: data[0] }));
      });
  }, []);

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
  const selectCategoryChangeHandler = (value) => {
    const categorySelect = dataCategory.find((item) => item.idCategory === value);
    setDataProd((prevData) => ({ ...prevData, category: categorySelect }));
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
    } else if (dataProd.category === null) {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Thể loại chưa được chọn',
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
    let idMax = 0;
    await fetch('http://localhost:8080/getIdProductMax')
      .then((response) => response.json())
      .then(
        (data) => {
          idMax = data;
        } //setIdProdMax(data)
      );
    //sau khi có idProd cho upload ảnh theo id
    // setActiveUpload(1);
    setDataHandler({ idMax: idMax });
  };

  const setDataHandler = (props) => {
    setIdProdMax(props.idMax);
    setActiveUpload(1);
    navigate('/products/showproduct');
    // setDataProd({
    //   nameProduct: '',
    //   price: 0,
    //   color: '',
    //   descProduct: '',
    //   quantity: 0,
    //   addDate: new Date(),
    //   isActive: 1,
    // });
  };

  return (
    <div className="wrap-addprod">
      <div className="wrap-addprod__item">
        <div className="addprod-input__ten">
          <InputCustom
            type="text"
            placeholder="Tên sản phẩm"
            onChange={nameProdOnchange}
            value={dataProd.nameProduct}
          />
          <div
            className={`addprod-input__ten-text ${
              dataProd.nameProduct !== '' ? 'addprod-input__ten-text--active' : ''
            }`}
          >
            Tên
          </div>
        </div>
        <div className="addprod-input__ten">
          <InputCustom
            step={5000}
            type="number"
            placeholder="Giá"
            onChange={priceProdOnchange}
            value={dataProd.price}
          />
          <div className={`addprod-input__ten-text addprod-input__ten-text--active`}>
            Giá
          </div>
        </div>

        <div className="addprod-input__ten">
          <InputCustom
            type="text"
            placeholder="Màu"
            onChange={colorProdOnchange}
            value={dataProd.color}
          />
          <div
            className={`addprod-input__ten-text ${
              dataProd.color !== '' ? 'addprod-input__ten-text--active' : ''
            }`}
          >
            Màu
          </div>
        </div>
        <div className="addprod-input__ten">
          <InputCustom
            type="text"
            placeholder="Miêu tả"
            onChange={descProdOnchange}
            value={dataProd.descProduct}
          />
          <div
            className={`addprod-input__ten-text ${
              dataProd.descProduct !== '' ? 'addprod-input__ten-text--active' : ''
            }`}
          >
            Miêu tả
          </div>
        </div>
        <div className="addprod-input__ten">
          <InputCustom
            type="number"
            placeholder="Số lượng"
            onChange={quantityProdOnchange}
            value={dataProd.quantity}
          />
          <div className={`addprod-input__ten-text addprod-input__ten-text--active`}>
            Số lượng
          </div>
        </div>

        <div className="wrapper-product__category">
          <span>Thể loại: </span>
          <Select
            value={
              dataProd.category !== null
                ? dataProd.category.idCategory
                : dataCategory[0].idCategory
            }
            style={{ width: 200 }}
            onChange={selectCategoryChangeHandler}
          >
            {dataCategory.map((item) => (
              <Option key={item.idCategory} value={item.idCategory}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>

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
