import React from 'react';
import './EditAccount.css';
import InputCustom from '../../base/InputCustom';
import { useState, useEffect } from 'react';
import ButtonCustom from '../../base/ButtonCustom';
import { LINKCONECT_BASE } from '../../../App';
import { notification, Select, Switch } from 'antd';
import { useLocation } from 'react-router-dom';

const EditAccount = () => {
  const { state } = useLocation();
  const [allRole, setAllRole] = useState([]);

  const [dataAccount, setDataAccount] = useState({
    idAccount: 0,
    email: '',
    password: '',
    role: {},
    isActive: 1,
  });
  const { Option } = Select;

  useEffect(() => {
    // lấy hết roles để đổ vào select
    fetch(`${LINKCONECT_BASE}/roles`)
      .then((response) => response.json())
      .then((data) => setAllRole(data));
    // lấy account theo id để set default edit
    fetch(`${LINKCONECT_BASE}/getAccountById?id=${state.idAccount}`)
      .then((response) => response.json())
      .then((data) => setDataAccount(data));
  }, []);

  const openNotificationWithIcon = (props) => {
    notification[props.type]({
      message: props.message,
      description: props.desc,
    });
  };

  const handleSelectChange = (value) => {
    console.log(`selected ${value}`);
    allRole.map((item) =>
      item.idRole === value
        ? setDataAccount((prevData) => ({
            ...prevData,
            role: { idRole: value, roleName: item.roleName },
          }))
        : ''
    );
  };
  const emailProdOnchange = (event) => {
    setDataAccount((prevData) => ({ ...prevData, email: event.target.value }));
  };
  const passwordProdOnchange = (event) => {
    setDataAccount((prevData) => ({ ...prevData, password: event.target.value }));
  };
  const switchHandler = (checked) => {
    if (checked) {
      setDataAccount((prevData) => ({ ...prevData, isActive: 1 }));
    } else {
      setDataAccount((prevData) => ({ ...prevData, isActive: 0 }));
    }
  };

  const btnEditHandler = () => {
    let regexEmail =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (dataAccount.email === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Vui lòng nhập Email',
      });
      return;
    } else if (!regexEmail.test(dataAccount.email.toLowerCase())) {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Sai cú pháp',
        desc: 'Vui lòng nhập Email có @gmail',
      });
      return;
    } else if (dataAccount.password === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Vui lòng nhập password',
      });
      return;
    } else if (Object.keys(dataAccount.role).length === 0) {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Vui lòng chọn quyền tài khoản',
      });
      return;
    }
    fetch(`${LINKCONECT_BASE}/addAccount`, {
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
      body: JSON.stringify(dataAccount),
    })
      .then((response) => response)
      .then((data) => {
        openNotificationWithIcon({
          type: 'success',
          message: 'Sửa thông tin tài khoản thành công',
          desc: dataAccount.email,
        });
      })
      .catch((error) => {
        openNotificationWithIcon({
          type: 'error',
          message: 'Sửa thông tin tài khoản thất bại',
          desc: error,
        });
      });
  };
  return (
    <div className="wrap-editaccount">
      <div className="wrap-editaccount__item">
        <InputCustom
          type="email"
          placeholder="Email"
          onChange={emailProdOnchange}
          value={dataAccount.email}
        />
        <InputCustom
          type="text"
          placeholder="Mật khẩu"
          onChange={passwordProdOnchange}
          value={dataAccount.password}
        />
        <div className="wrap-account-select">
          <span className="account-select__title">Quyền tài khoản</span>
          <Select
            value={dataAccount.role.idRole}
            style={{ width: 200 }}
            onChange={handleSelectChange}
          >
            {allRole.map((item) => (
              <Option key={item.idRole} value={item.idRole}>
                {item.roleName}
              </Option>
            ))}
          </Select>
        </div>

        <div className="editaccount-item__action wrapp-btn-upload">
          {/* {<ButtonUploadImg activeUpload={activeUpload} idMaxProduct={idProdMax} />} */}
        </div>
        <div className="editaccount-item__action">
          <div className="editaccount-item__Switch">
            <span>Trạng thái hoạt động</span>
            <Switch defaultChecked onChange={switchHandler} />
          </div>

          <div className="editaccount-item__btn">
            <ButtonCustom
              style={{ backgroundColor: 'var(--color-btn-add)' }}
              onClick={btnEditHandler}
            >
              Lưu thông tin
            </ButtonCustom>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAccount;
