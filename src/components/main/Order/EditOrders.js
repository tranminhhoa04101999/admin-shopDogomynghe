import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LINKCONECT_BASE, LINKIMG_BASE } from '../../../App';
import './EditOrders.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { Select, Button, notification } from 'antd';
import moment from 'moment';

const EditOrders = () => {
  const { state } = useLocation();
  const [dataOrderFull, setDataOrderFull] = useState(null);
  const [idStatusNew, setIdStatusNew] = useState(0);
  const [dataStatus, setDataStatus] = useState([]);
  const [dataStatusThanhToan, setDataStatusThanhToan] = useState([]);
  const [idEmployee, setIdEmployee] = useState(0);
  const [reload, setReload] = useState(0);
  const accountLogined = JSON.parse(localStorage.getItem('infoAccountLogined'));

  const { Option } = Select;
  const navigate = useNavigate();

  const openNotificationWithIcon = (props) => {
    notification[props.type]({
      message: props.message,
      description: props.desc,
    });
  };
  useEffect(() => {
    if (state === null) {
      navigate('/orders');
    }
    fetch(
      `${LINKCONECT_BASE}/searchOrderByIdOrPhone?idStatus=6&idOrders=${state.idOrder}&phone=0`
    )
      .then((response) => response.json())
      .then((data) => {
        setDataOrderFull(data[0]);
        setIdStatusNew(data[0].orders.status.idStatus);
        if (data[0].orders.status.idStatus === 3) {
          fetch(`${LINKCONECT_BASE}/statusThanhToan`)
            .then((response) => response.json())
            .then((data) => setDataStatusThanhToan(data));
        }
        fetch(
          `${LINKCONECT_BASE}/statusgetlonhon?idStatus=${data[0].orders.status.idStatus}`
        )
          .then((response) => response.json())
          .then((data) => setDataStatus(data));
      });

    // fetch(`${LINKCONECT_BASE}/allstatus`)
    //   .then((response) => response.json())
    //   .then((data) => setDataStatus(data));

    //lấy ra id Employee
    fetch(
      `${LINKCONECT_BASE}/employeeFindByIdAccount?idAccount=${accountLogined.idAccount}`
    )
      .then((response) => response.json())
      .then((data) => setIdEmployee(data[0].idAccount));
  }, []);

  useEffect(() => {
    fetch(
      `${LINKCONECT_BASE}/searchOrderByIdOrPhone?idStatus=6&idOrders=${state.idOrder}&phone=0`
    )
      .then((response) => response.json())
      .then((data) => {
        setDataOrderFull(data[0]);
        setIdStatusNew(data[0].orders.status.idStatus);
      });
  }, [reload]);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
  });

  const selectStatusHandler = (value) => {
    setIdStatusNew(value);
  };

  const btnSelectOnClickHandler = async () => {
    setReload(true);
    await fetch(
      `${LINKCONECT_BASE}/UpdateStatusByidStatusAndId?idStatus=${idStatusNew}&idOrders=${state.idOrder}&idEmployee=${idEmployee}`,
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
        if (data === 1) {
          openNotificationWithIcon({
            type: 'success',
            message: 'Thay đổi trạng thái thành công',
            desc: '',
          });
          setReload(Math.random());
        }
      });
    setReload(false);
  };
  return (
    <div>
      {dataOrderFull !== null && (
        <div className="grid wide" style={{ overflow: 'hidden' }}>
          <div className="row">
            <div className="col l-1"></div>
            <div className="col l-7 container-searchOrder-col-top">
              <div className="row wapper-searchorder-main-left">
                <div className="col l-4 searchorder-main-left">
                  <p className="searchorder-main-left__title">Địa Chỉ Nhận Hàng</p>
                  <p className="searchorder-main-left__name">
                    Tên : {dataOrderFull.orders.customer.name}
                  </p>
                  <p className="searchorder-main-left_phone">
                    SĐT : {dataOrderFull.orders.phone}
                  </p>
                  <p className="searchorder-main-left_address">
                    Địa chỉ : {dataOrderFull.orders.address}
                  </p>
                </div>
                <div className="col l-8 ">
                  <div className="searchOrder-Status">
                    <FontAwesomeIcon icon={faCircleNotch} size="2x" />
                    <div className="searchOrder-Status__title">
                      {dataOrderFull.orders.status.statusName}
                    </div>
                    {dataOrderFull.orders.status.idStatus < 5 && (
                      <FontAwesomeIcon icon={faLongArrowAltRight} size="2x" />
                    )}
                    {dataStatusThanhToan.length === 0 ? (
                      <div>
                        {dataOrderFull.orders.status.idStatus < 5 && (
                          <Select
                            value={idStatusNew}
                            style={{ width: 120, margin: '0 10px ' }}
                            onChange={selectStatusHandler}
                          >
                            {dataStatus.map((itemS, index) => (
                              <Option key={index} value={itemS.idStatus}>
                                {itemS.statusName}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </div>
                    ) : (
                      <div>
                        {dataOrderFull.orders.status.idStatus < 5 && (
                          <Select
                            value={idStatusNew}
                            style={{ width: 120, margin: '0 10px ' }}
                            onChange={selectStatusHandler}
                          >
                            {dataStatusThanhToan.map((itemS, index) => (
                              <Option key={index} value={itemS.idStatus}>
                                {itemS.statusName}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </div>
                    )}

                    {dataOrderFull.orders.status.idStatus < 5 && (
                      <Button
                        loading={reload ? 1 : 0}
                        onClick={() => btnSelectOnClickHandler()}
                      >
                        Chuyển
                      </Button>
                    )}
                  </div>
                  <div className="searchOrder-Status__total">
                    {dataOrderFull.orders.employee !== null ? (
                      <div>Nhân viên chỉnh sửa:</div>
                    ) : (
                      ''
                    )}
                    <span>
                      {dataOrderFull.orders.employee !== null
                        ? dataOrderFull.orders.employee.name
                        : ''}
                    </span>
                    ngày
                    <span>
                      {dataOrderFull.orders.dateEnd === null
                        ? moment(dataOrderFull.orders.dateModified).format('DD/MM/YYYY')
                        : moment(dataOrderFull.orders.dateEnd).format('DD/MM/YYYY')}
                    </span>
                  </div>
                  <div className="searchOrder-Status__total">
                    Tổng tiền đơn hàng:{' '}
                    <span>
                      {formatter.format(
                        dataOrderFull.productSearchResponses.reduce(
                          (prev, cur) => prev + cur.price * cur.quantity,
                          0
                        )
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row wapper-searchOrder">
            <div className="col l-1"></div>
            <div className="col l-7 container-searchOrder-col-bottom">
              <table className="cart-table">
                <thead></thead>
                <tbody className="searchOrderTable-body">
                  {dataOrderFull.productSearchResponses.map((itemProd, indexProd) => (
                    <tr key={indexProd} className="cart-table-body-tr">
                      <td className="cart-table-img">
                        <div className="cart-table-img__wrap-img">
                          <img
                            src={`${LINKIMG_BASE}${itemProd.imgURL}.jpg?alt=media`}
                            alt=""
                            className="cart-table-img__img"
                          />
                        </div>
                        <div className="cart-table-img__wrap-variant">
                          <p className="cart-table-img__link">{itemProd.nameProduct}</p>
                          <p className="cart-table-img__variant">x{itemProd.quantity}</p>
                        </div>
                      </td>
                      <td className="cart-table__wrap-price">
                        <div className="cart-table__wrap-price-old">
                          {formatter.format(itemProd.price)}
                        </div>
                        <div className="cart-table__wrap-price-total">
                          Tổng tiền:{' '}
                          {formatter.format(itemProd.price * itemProd.quantity)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditOrders;
