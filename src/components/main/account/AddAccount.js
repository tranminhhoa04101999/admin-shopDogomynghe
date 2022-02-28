import React from 'react';
import './AddAccount.css';
import InputCustom from '../../base/InputCustom';
import { useState } from 'react';
import { Switch, Select, Option } from 'antd';
import ButtonCustom from '../../base/ButtonCustom';
import { LINKCONECT_BASE } from '../../../App';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AddAccount = () => {
  const [allRole, setAllRole] = useState([]);
  const navigate = useNavigate();

  const [dataAccount, setDataAccount] = useState({
    email: '',
    password: '',
    role: {},
    isActive: 1,
  });

  useEffect(() => {
    fetch(`${LINKCONECT_BASE}/roles`)
      .then((response) => response.json())
      .then((data) => setAllRole(data));
  }, []);

  const openNotificationWithIcon = (props) => {
    notification[props.type]({
      message: props.message,
      description: props.desc,
    });
  };
  const { Option } = Select;

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
  const btnSubmitHandler = () => {
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
      .then((response) => response.json())
      .then((data) => {
        if (data === 1) {
          openNotificationWithIcon({
            type: 'success',
            message: 'Thêm mới thành công',
            desc: dataAccount.email,
          });
          navigate('/account/showaccount');
        } else if (data === 2) {
          openNotificationWithIcon({
            type: 'error',
            message: 'Email này đã tồn tại',
            desc: 'Không thể tạo mới',
          });
        }
      })
      .catch((error) => {
        openNotificationWithIcon({
          type: 'error',
          message: 'Thêm mới thất bại',
          desc: error,
        });
      });
    //thêm thành công thì ra trang chính
  };
  return (
    <div className="wrap-addaccount">
      <div className="wrap-addaccount__item">
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
          <Select style={{ width: 200 }} onChange={handleSelectChange}>
            {allRole.map((item) => (
              <Option key={item.idRole} value={item.idRole}>
                {item.roleName}
              </Option>
            ))}
          </Select>
        </div>

        <div className="addaccount-item__action wrapp-btn-upload">
          {/* {<ButtonUploadImg activeUpload={activeUpload} idMaxProduct={idProdMax} />} */}
        </div>
        <div className="addaccount-item__action">
          <div className="addaccount-item__Switch">
            <span>Trạng thái hoạt động</span>
            <Switch defaultChecked onChange={switchHandler} />
          </div>

          <div className="addaccount-item__btn">
            <ButtonCustom
              style={{ backgroundColor: 'var(--color-btn-add)' }}
              onClick={btnSubmitHandler}
            >
              Tạo tài khoản
            </ButtonCustom>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccount;
