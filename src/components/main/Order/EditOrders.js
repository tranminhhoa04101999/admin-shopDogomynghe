import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LINKCONECT_BASE, LINKIMG_BASE } from '../../../App';
import './EditOrders.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { Select, Button } from 'antd';

const EditOrders = () => {
  const { state } = useLocation();
  const [dataOrderFull, setDataOrderFull] = useState(null);
  const [idStatusNew, setIdStatusNew] = useState(0);
  const [dataStatus, setDataStatus] = useState([]);

  const { Option } = Select;
  const navigate = useNavigate();

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
      });

    fetch(`${LINKCONECT_BASE}/allstatus`)
      .then((response) => response.json())
      .then((data) => setDataStatus(data));
  }, []);

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
  });

  const selectStatusHandler = (value) => {
    setIdStatusNew(value);
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
                    <FontAwesomeIcon icon={faLongArrowAltRight} size="2x" />

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
                    <Button>Chuyển</Button>
                  </div>
                  <div className="searchOrder-Status__total">
                    Tổng tiền đơn hàng:{' '}
                    <span>{formatter.format(dataOrderFull.orders.total)}</span>
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
