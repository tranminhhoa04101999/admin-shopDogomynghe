import React, { useEffect } from 'react';
import './ShowInfomation.css';
import InputCustom from '../../base/InputCustom';
import { LINKCONECT_BASE } from '../../../App';
import ButtonCustom from '../../base/ButtonCustom';
import { useState } from 'react';
import { notification } from 'antd';

const INITIAL_EMPLOYEE = {
  idAccount: 0,
  name: '',
  phone: '',
  address: '',
  dateBegin: '2022-02-24T17:00:00.000+00:00',
  dateEnd: null,
  isWorking: 1,
};
const INITIAL_ACCOUNT = {
  idAccount: 0,
  email: '',
  password: '',
  role: {},
  isActive: 1,
};

const ShowInfomation = () => {
  const dataInfo = JSON.parse(localStorage.getItem('infoAccountLogined'));
  const [dataEmployee, setDataEmployee] = useState(INITIAL_EMPLOYEE);
  const [dataAccount, setDataAccount] = useState(INITIAL_ACCOUNT);

  useEffect(() => {
    // lay thong tin employeee
    fetch(`${LINKCONECT_BASE}/employeeFindByIdAccount?idAccount=${dataInfo.idAccount}`)
      .then((response) => response.json())
      .then((data) => {
        setDataEmployee(data[0]);
        fetch(`${LINKCONECT_BASE}/getAccountById?id=${data[0].idAccount}`)
          .then((response) => response.json())
          .then((data1) => setDataAccount(data1));
      });
  }, []);
  const openNotificationWithIcon = (props) => {
    notification[props.type]({
      message: props.message,
      description: props.desc,
    });
  };

  const inputNameOnChange = (event) => {
    setDataEmployee((prevData) => ({ ...prevData, name: event.target.value }));
  };
  const inputEmailOnChange = () => {};
  const inputAddressOnChange = (event) => {
    setDataEmployee((prevData) => ({ ...prevData, address: event.target.value }));
  };
  const inputPhoneOnChange = (event) => {
    setDataEmployee((prevData) => ({ ...prevData, phone: event.target.value }));
  };

  const btnSubmitHandler = () => {
    if (dataEmployee.name === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Họ Tên trống',
        desc: 'Vui lòng điền họ tên',
      });
      return;
    } else if (dataEmployee.phone === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Số điện thoại trống',
        desc: 'Vui lòng điền SĐT',
      });
      return;
    } else if (dataEmployee.phone.length + 1 <= 10) {
      openNotificationWithIcon({
        type: 'warning',
        message: 'SĐT chưa đúng',
        desc: 'SĐT phải nhiều hơn 9 số',
      });
      return;
    } else if (dataEmployee.address === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Địa chỉ trống',
        desc: 'Vui lòng điền địa chỉ',
      });
      return;
    }
    fetch(`${LINKCONECT_BASE}/employeeSave`, {
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
      body: JSON.stringify(dataEmployee),
    })
      .then((response) => response.json())
      .then((data) =>
        openNotificationWithIcon({
          type: 'success',
          message: 'Thay đổi thành công',
          desc: '',
        })
      );
  };
  return (
    <div className="wrap-addaccount">
      <div className="wrap-addaccount__item">
        <InputCustom
          type="text"
          placeholder="Email"
          disabled={true}
          value={dataAccount.email}
        />
        <InputCustom
          type="text"
          placeholder="Họ Và Tên*"
          value={dataEmployee.name}
          onChange={inputNameOnChange}
        />
        <InputCustom
          type="text"
          placeholder="Số điện thoại*"
          value={dataEmployee.phone}
          onChange={inputPhoneOnChange}
        />
        <InputCustom
          type="text"
          placeholder="Địa chỉ*"
          value={dataEmployee.address}
          onChange={inputAddressOnChange}
        />
        <div className="showInfomation-dateBegin">
          <span>Ngày bắt đầu làm</span>
        </div>
        <InputCustom
          type="text"
          placeholder="Ngày bắt đầu làm"
          value={dataEmployee.dateBegin}
          onChange={() => {}}
          disabled={true}
        />
        <div className="addaccount-item__action">
          <div className="addaccount-item__btn">
            <ButtonCustom
              style={{ backgroundColor: 'var(--color-btn-add)' }}
              onClick={() => btnSubmitHandler()}
            >
              Thay đổi thông tin
            </ButtonCustom>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowInfomation;
