import React from 'react';
import './EditDiscount.css';
import InputCustom from '../../base/InputCustom';
import { useState, useEffect } from 'react';
import { Switch } from 'antd';
import ButtonCustom from '../../base/ButtonCustom';
import { LINKCONECT_BASE } from '../../../App';
import { notification, InputNumber, Space } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const EditDiscount = () => {
  const [dataDiscount, setDataDiscount] = useState({
    idDiscount: 0,
    nameDiscount: '',
    descDiscount: '',
    percent: 0,
    dateCreate: new Date(),
    dateModified: null,
    isActive: 1,
  });
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (state === null) {
      navigate('/showdiscount');
    }
    // console.log('first', state.data);
    setDataDiscount(state.data);
  }, []);

  const openNotificationWithIcon = (props) => {
    notification[props.type]({
      message: props.message,
      description: props.desc,
    });
  };
  const nameDiscountOnchange = (event) => {
    setDataDiscount((prevData) => ({ ...prevData, nameDiscount: event.target.value }));
  };
  const descDiscountOnchange = (event) => {
    setDataDiscount((prevData) => ({ ...prevData, descDiscount: event.target.value }));
  };
  const percentOnChange = (value) => {
    setDataDiscount((prevData) => ({ ...prevData, percent: value / 100 }));
  };

  const switchHandler = (checked) => {
    if (checked) {
      setDataDiscount((prevData) => ({ ...prevData, isActive: 1 }));
    } else {
      setDataDiscount((prevData) => ({ ...prevData, isActive: 0 }));
    }
  };

  const btnSubmitHandler = () => {
    if (dataDiscount.nameDiscount === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Tên không được để trống',
      });
      return;
    } else if (dataDiscount.descDiscount === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Mô tả không được để trống',
      });
      return;
    }
    // thêm ngày sửa
    let dataAdd = dataDiscount;
    dataAdd.dateModified = new Date();
    fetch(`${LINKCONECT_BASE}/adddiscount`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accepts: '*/*',

        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(dataAdd),
    })
      .then((response) => response)
      .then((data) => {
        openNotificationWithIcon({
          type: 'success',
          message: 'Thay đổi thành công',
          desc: dataAdd.nameDiscount,
        });
      })
      .catch((error) =>
        openNotificationWithIcon({
          type: 'error',
          message: 'Thay đổi thất bại',
          desc: error,
        })
      );
  };
  console.log('percent', dataDiscount.percent);
  return (
    <div className="wrap-adddiscount">
      <div className="wrap-adddiscount__item">
        <InputCustom
          type="text"
          placeholder="Tên giảm giá"
          onChange={nameDiscountOnchange}
          value={dataDiscount.nameDiscount}
        />
        <InputCustom
          type="text"
          placeholder="Mô tả"
          onChange={descDiscountOnchange}
          value={dataDiscount.descDiscount}
        />
        <Space style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
          <span style={{ fontSize: '1.4rem' }}>Chọn phần trăm giảm giá: </span>
          <InputNumber
            value={dataDiscount.percent * 100}
            min={0}
            max={100}
            size="middle"
            formatter={(value) => `${value}%`}
            parser={(value) => value.replace('%', '')}
            onChange={percentOnChange}
          />
        </Space>
        <div className="adddiscount-item__action">
          <div className="adddiscount-item__Switch">
            <span>Hoạt động</span>
            <Switch
              checked={dataDiscount.isActive === 1 ? true : false}
              onChange={switchHandler}
            />
          </div>

          <div className="adddiscount-item__btn">
            <ButtonCustom
              style={{ backgroundColor: 'var(--color-btn-add)' }}
              onClick={btnSubmitHandler}
            >
              Thay đổi
            </ButtonCustom>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDiscount;
