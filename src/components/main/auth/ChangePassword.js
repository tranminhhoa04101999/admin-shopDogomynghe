import React from 'react';
import ButtonCustom from '../../base/ButtonCustom';
import './ChangePassword.css';
import { Input, notification } from 'antd';
import { useState } from 'react';
import { LINKCONECT_BASE } from '../../../App';

const ChangePassword = () => {
  const dataInfo = JSON.parse(localStorage.getItem('infoAccountLogined'));
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newPassCheck, setNewPassCheck] = useState('');

  const oldPassHandler = (event) => {
    setOldPass(event.target.value);
  };
  const newPassHandler = (event) => {
    setNewPass(event.target.value);
  };
  const newPassCheckHandler = (event) => {
    setNewPassCheck(event.target.value);
  };
  const openNotificationWithIcon = (props) => {
    notification[props.type]({
      message: props.message,
      description: props.desc,
    });
  };
  const btnSubmitHandler = () => {
    if (oldPass === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Mật khẩu cũ trống',
        desc: 'Vui lòng điền mật khẩu cũ',
      });
      return;
    } else if (oldPass.length <= 5) {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Mật khẩu cũ quá ngắn',
        desc: 'mật khẩu phải 6 ký tự',
      });
      return;
    } else if (newPass === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Mật khẩu mới trống',
        desc: 'Vui lòng điền mật khẩu',
      });
      return;
    } else if (newPass.length <= 5) {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Mật khẩu mới quá ngắn',
        desc: 'mật khẩu phải 6 ký tự',
      });
      return;
    } else if (newPassCheck !== newPass) {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Mật khẩu nhập lại không khớp',
        desc: '',
      });
      return;
    }
    fetch(
      `${LINKCONECT_BASE}/changePass?email=${dataInfo.email}&oldPass=${oldPass}&newPass=${newPass}`,
      {
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
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data === 0) {
          openNotificationWithIcon({
            type: 'error',
            message: 'lỗi server đổi thất bại',
            desc: '',
          });
        } else if (data === 1) {
          openNotificationWithIcon({
            type: 'success',
            message: 'Thay đổi mật khẩu thành công',
            desc: '',
          });
          setOldPass('');
          setNewPass('');
          setNewPassCheck('');
        } else if (data === 3) {
          openNotificationWithIcon({
            type: 'error',
            message: 'sai mật khẩu cũ',
            desc: '',
          });
        }
      });
  };
  return (
    <div className="wrap-addaccount">
      <div className="wrap-addaccount__item">
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <div>
            <div className="wapper-changepassword__input">
              <span className="wapper-changepassword__input-title">Mật khẩu cũ: </span>
              <Input.Password
                placeholder="input password"
                onChange={oldPassHandler}
                value={oldPass}
              />
            </div>
            <div className="wapper-changepassword__input">
              <span className="wapper-changepassword__input-title">Mật khẩu Mới: </span>
              <Input.Password
                placeholder="input password"
                onChange={newPassHandler}
                value={newPass}
              />
            </div>
            <div className="wapper-changepassword__input">
              <span className="wapper-changepassword__input-title">
                Nhập lại mật khẩu:
              </span>
              <Input.Password
                placeholder="input password"
                onChange={newPassCheckHandler}
                value={newPassCheck}
              />
            </div>
          </div>
        </div>

        <div className="addaccount-item__action">
          <div className="addaccount-item__btn">
            <ButtonCustom
              style={{ backgroundColor: 'var(--color-btn-add)' }}
              onClick={() => btnSubmitHandler()}
            >
              Thay đổi mật khẩu
            </ButtonCustom>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
