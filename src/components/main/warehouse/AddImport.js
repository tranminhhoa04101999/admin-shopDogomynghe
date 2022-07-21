import React, { useEffect, useState } from 'react';
import { Card, Select, Tag, Button, notification, Image, Popconfirm } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import './AddImport.css';
import { LINKCONECT_BASE, LINKIMG_BASE } from '../../../App';
import InputCustom from '../../base/InputCustom';
import ButtonCustom from '../../base/ButtonCustom';
import moment from 'moment';

const IMPORT_INITIAL = {
  sourceName: '',
  listProd: [],
};

const style_btnLuu = {
  backgroundColor: 'var(--btn-color)',
  color: 'white',
  width: '80px',
  marginTop: '40px',
};
const AddImport = () => {
  const [options, setOptions] = useState([]);
  const [listIdProduct, setListIdProduct] = useState([]);
  const [dataImport, setDataImport] = useState(IMPORT_INITIAL);
  const [idEmployee, setIdEmployee] = useState(0);
  const [nameEmployee, setNameEmployee] = useState('');
  const accountLogined = JSON.parse(localStorage.getItem('infoAccountLogined'));

  useEffect(() => {
    fetch(`${LINKCONECT_BASE}/allproduct`)
      .then((response) => response.json())
      .then((data) => {
        data.map((item) =>
          setOptions((prev) => [
            ...prev,
            {
              value: item.idProduct,
              label: 'ID: ' + item.idProduct + ' ' + item.nameProduct,
            },
          ])
        );
      });
    //lấy ra id Employee
    fetch(
      `${LINKCONECT_BASE}/employeeFindByIdAccount?idAccount=${accountLogined.idAccount}`
    )
      .then((response) => response.json())
      .then((data) => {
        setIdEmployee(data[0].idAccount);
        setNameEmployee(data[0].name);
      });
  }, []);
  function tagRender(props) {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    return (
      <Tag
        color="green"
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 5 }}
      >
        {label}
      </Tag>
    );
  }
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
  });
  const openNotificationWithIcon = (props) => {
    notification[props.type]({
      message: props.message,
      description: props.desc,
    });
  };
  const selectProdOnchangeHandler = (value) => {
    setListIdProduct(value);
  };
  const btnOnlickHandler = () => {
    let listProdNew = [];

    listIdProduct.map((item) => {
      /// kiểm tra nếu tồn tại rồi thì không thêm nữa
      let checkExist = dataImport.listProd.findIndex((prod) => prod.id === item);
      if (checkExist >= 0) {
        listProdNew.push(dataImport.listProd[checkExist]);
      } else {
        fetch(`http://localhost:8080/getproductbyid?idProduct=${item}`)
          .then((response) => response.json())
          .then((data) => {
            listProdNew.push({
              id: data.idProduct,
              name: data.nameProduct,
              quantity: 0,
              price: 0,
            });
          });
      }
    });
    setTimeout(() => {
      setDataImport((prev) => ({ ...prev, listProd: listProdNew }));
    }, 100);
  };
  const onChangeQuantityHandler = (event, param1) => {
    let listProdOld = dataImport.listProd;
    let index = listProdOld.findIndex((item) => item.id === param1);
    let temp = listProdOld.find((item) => item.id === param1);
    temp.quantity = event.target.value;
    let listProdNew = listProdOld.fill(temp, index, index);
    setDataImport((prev) => ({ ...prev, listProd: listProdNew }));
  };
  const onChangePriceHandler = (event, param1) => {
    let listProdOld = dataImport.listProd;
    let index = listProdOld.findIndex((item) => item.id === param1);
    let temp = listProdOld.find((item) => item.id === param1);
    temp.price = event.target.value;
    let listProdNew = listProdOld.fill(temp, index, index);
    setDataImport((prev) => ({ ...prev, listProd: listProdNew }));
  };
  const btnNhapOnClick = () => {
    if (dataImport.sourceName.trim() === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Vui lòng nhập tên nguồn nhập !',
      });
      return;
    }
    let validate = [];
    validate = dataImport.listProd.map((item) => {
      if (item.price === 0 || item.price === '' || item.price === '0') {
        openNotificationWithIcon({
          type: 'warning',
          message: 'Lỗi để trống',
          desc: 'Vui lòng nhập giá sản phẩm ' + item.name,
        });
        return 1;
      } else if (item.quantity === 0 || item.quantity === '' || item.quantity === '0') {
        openNotificationWithIcon({
          type: 'warning',
          message: 'Lỗi để trống',
          desc: 'Vui lòng nhập số lượng sản phẩm ' + item.name,
        });
        return 1;
      } else {
        return 0;
      }
    });
    console.log('validate', validate);
    let checkvalidate = -1;
    checkvalidate = validate.findIndex((item) => item === 1);
    if (checkvalidate < 0) {
      fetch(`${LINKCONECT_BASE}/addImport?idEmployee=${idEmployee}`, {
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
        body: JSON.stringify(dataImport),
      })
        .then((response) => response.json())
        .then((data) => {
          openNotificationWithIcon({
            type: 'success',
            message: data.idResult === 1 ? 'Thành Công' : 'Thất bại',
            desc: data.message,
          });
          if (data.idResult === 1) {
            setDataImport(IMPORT_INITIAL);
          }
        })
        .catch((error) => {
          openNotificationWithIcon({
            type: 'error',
            message: 'thất bại',
            desc: error,
          });
        });
    }
  };
  const onChangeSourceName = (event) => {
    setDataImport((prev) => ({ ...prev, sourceName: event.target.value }));
  };
  return (
    <div>
      <div className="container-select-addimport">
        <span className="select-addimport_title">Chọn sản phẩm nhập hàng: </span>
        <Select
          mode="multiple"
          showArrow
          tagRender={tagRender}
          style={{ width: '100%' }}
          options={options}
          onChange={selectProdOnchangeHandler}
        />
        <Button style={{ margin: '0 10px' }} onClick={() => btnOnlickHandler()}>
          Chọn
        </Button>
      </div>
      <div className="grid wide">
        <div className="container_addimport">
          <div className="row">
            <div className="col l-12 addimport_col-top">
              <span>PHIẾU NHẬP</span>
            </div>
          </div>
          <div className="row">
            <div className="col l-4 addimport_col-center">
              <span>Tên nguồn nhập: </span>
              <InputCustom
                type="text"
                placeholder="Nhập"
                onChange={onChangeSourceName}
                value={dataImport.sourceName}
              />
            </div>
            <div className="col l-4 addimport_col-center">
              <span>Ngày Nhập: {moment(new Date()).format('DD/MM/YYYY')}</span>
            </div>
          </div>
          <div className="col l-12 addimport_col-prod">
            <div className="row wrapper-importProd_head">
              <div className="col l-4">Tên sản phẩm</div>
              <div className="col l-2">Mã SP</div>
              <div className="col l-2">Số lượng</div>
              <div className="col l-2">Đơn giá</div>
              <div className="col l-2">Thành tiền</div>
            </div>
            {dataImport.listProd.length > 0 ? (
              <div>
                {dataImport.listProd.map((item, index) => (
                  <div key={index} className="row wrapper-importProd_center">
                    <div className="col l-4">
                      <span>{item.name}</span>
                    </div>
                    <div className="col l-2">
                      <span>{item.id}</span>
                    </div>
                    <div className="col l-2">
                      <InputCustom
                        type="number"
                        value={item.quantity}
                        onChange={(event) => onChangeQuantityHandler(event, item.id)}
                      />
                    </div>
                    <div className="col l-2">
                      <InputCustom
                        type="number"
                        value={item.price}
                        step={5000}
                        onChange={(event) => onChangePriceHandler(event, item.id)}
                      />
                    </div>
                    <div className="col l-2">
                      <span>{formatter.format(item.quantity * item.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              'Chưa nhập sản phẩm'
            )}

            {dataImport.listProd.length > 0 ? (
              <div className="row wrapper-importProd_total">
                <div className="col l-o-8 l-2 importProd_total-title">Tổng:</div>
                <div className="col l-2 importProd_total-price">
                  {' '}
                  {formatter.format(
                    dataImport.listProd.reduce(
                      (prev, current) => (prev = prev + current.price * current.quantity),
                      0
                    )
                  )}
                </div>
              </div>
            ) : (
              ''
            )}
            <div className="row wrapper-importProd_btn">
              <div className="col l-4 importProd_btn-nguoilap">
                <span>Người lập phiếu: {nameEmployee}</span>
              </div>
              {dataImport.listProd.length > 0 && (
                <div
                  className="col l-o-6 l-2"
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <ButtonCustom style={style_btnLuu} onClick={() => btnNhapOnClick()}>
                    {' '}
                    Nhập{' '}
                  </ButtonCustom>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddImport;
