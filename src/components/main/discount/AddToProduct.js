import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AddToProduct.css';
import { Card, Select, Tag, Button, notification, Image, Popconfirm } from 'antd';
import { LINKCONECT_BASE, LINKIMG_BASE } from '../../../App';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ButtonCustom from '../../base/ButtonCustom';
const gridStyle = {
  width: '100%',
  textAlign: 'center',
  padding: '10px',
};

const gridStyleProd = {
  width: '25%',
  textAlign: 'center',
  padding: '10px',
};
const AddToProduct = () => {
  const { state } = useLocation();
  const [dataDiscount, setDataDiscount] = useState(null);
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [optionsCate, setOptionsCate] = useState([]);
  const [listIdProduct, setListIdProduct] = useState([]);
  const [listIdCate, setListIdCate] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (state !== null) {
      setDataDiscount(state.data);
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
      fetch(`${LINKCONECT_BASE}/allcategory`)
        .then((response) => response.json())
        .then((data) => {
          data.map((item) =>
            setOptionsCate((prev) => [
              ...prev,
              {
                value: item.idCategory,
                label: 'ID: ' + item.idCategory + ' ' + item.name,
              },
            ])
          );
        });
      fetch(
        `${LINKCONECT_BASE}/discountFindProductByIdDiscount?idDiscount=${state.data.idDiscount}`
      )
        .then((response) => response.json())
        .then((data) => setListProduct(data));
    } else {
      navigate('/discount/showdiscount');
    }
  }, []);
  useEffect(() => {
    fetch(
      `${LINKCONECT_BASE}/discountFindProductByIdDiscount?idDiscount=${state.data.idDiscount}`
    )
      .then((response) => response.json())
      .then((data) => setListProduct(data));

    return () => {
      setReload(0);
    };
  }, [reload]);

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
  const selectProdOnchangeHandler = (value) => {
    setListIdProduct(value);
  };
  const selectCateOnchangeHandler = (value) => {
    setListIdCate(value);
  };

  const btnOnlickHandler = () => {
    if (listIdProduct.length === 0) {
      openNotificationWithIcon({
        type: 'warning',
        message: 'B???n ch??a ch???n s???n ph???m ????? ??p d???ng',
        desc: 'Ch???n ??i n??o',
      });
    } else {
      fetch(
        `${LINKCONECT_BASE}/UpdateProductByidDiscountAndId?idDiscount=${dataDiscount.idDiscount}`,
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Accepts: '*/*',

            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(listIdProduct),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data === 1) {
            openNotificationWithIcon({
              type: 'success',
              message: 'Th??nh c??ng',
              desc: '??p d???ng gi???m gi?? th??nh c??ng',
            });
            setReload(1);
          }
          if (data === 0) {
            openNotificationWithIcon({
              type: 'error',
              message: 'Th???t b???i',
              desc: '??p d???ng th???t b???i',
            });
          }
        })
        .catch((error) =>
          openNotificationWithIcon({
            type: 'error',
            message: '??p d???ng th???t b???i',
            desc: error,
          })
        );
    }
  };
  const btnCateOnClick = () => {
    if (listIdCate.length === 0) {
      openNotificationWithIcon({
        type: 'warning',
        message: 'B???n ch??a ch???n s???n ph???m ????? ??p d???ng',
        desc: 'Ch???n ??i n??o',
      });
    } else {
      fetch(
        `${LINKCONECT_BASE}/updateDiscountWithListIdCate?idDiscount=${dataDiscount.idDiscount}`,
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Accepts: '*/*',

            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(listIdCate),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data === 1) {
            openNotificationWithIcon({
              type: 'success',
              message: 'Th??nh c??ng',
              desc: '??p d???ng gi???m gi?? th??nh c??ng',
            });
            setReload(1);
          }
          if (data === 0) {
            openNotificationWithIcon({
              type: 'error',
              message: 'Th???t b???i',
              desc: '??p d???ng th???t b???i',
            });
          }
        })
        .catch((error) =>
          openNotificationWithIcon({
            type: 'error',
            message: '??p d???ng th???t b???i',
            desc: error,
          })
        );
    }
  };

  const removeProdHandler = (props) => {
    fetch(`${LINKCONECT_BASE}/RemoveByIdProduct?idProduct=${props.idProduct}`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accepts: '*/*',

        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 1) {
          openNotificationWithIcon({
            type: 'success',
            message: 'Th??nh c??ng',
            desc: 'X??a s???n ph???m ' + props.idProduct + ' kh???i gi???m gi?? n??y',
          });
          setReload(1);
        }
        if (data === 0) {
          openNotificationWithIcon({
            type: 'error',
            message: 'Th???t b???i',
            desc: 'X??a s???n ph???m kh???i gi???m gi?? n??y th???t b???i',
          });
        }
      })
      .catch((error) =>
        openNotificationWithIcon({
          type: 'error',
          message: 'X??a s???n ph???m kh???i gi???m gi?? n??y th???t b???i',
          desc: error,
        })
      );
  };

  const btnRemoveCateOnClick = () => {
    fetch(`${LINKCONECT_BASE}/updateDiscountNullByListIdCate`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accepts: '*/*',

        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(listIdCate),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === 1) {
          openNotificationWithIcon({
            type: 'success',
            message: 'Th??nh c??ng',
            desc: 'X??a s???n ph???m kh???i gi???m gi?? n??y',
          });
          setReload(1);
        }
        if (data === 0) {
          openNotificationWithIcon({
            type: 'error',
            message: 'Th???t b???i',
            desc: 'X??a s???n ph???m kh???i gi???m gi?? n??y th???t b???i',
          });
        }
      })
      .catch((error) =>
        openNotificationWithIcon({
          type: 'error',
          message: 'X??a s???n ph???m kh???i gi???m gi?? n??y th???t b???i',
          desc: error,
        })
      );
  };
  return (
    <div>
      {dataDiscount !== null && (
        <div className="container-addtoproduct">
          <Card>
            <Card.Grid style={gridStyle}>
              <div className="addtoproduct__card">
                <span>
                  ID: <p>{dataDiscount.idDiscount}</p>
                </span>
                <span>
                  T??n gi???m gi??: <p>{dataDiscount.nameDiscount}</p>
                </span>
                <span>
                  M?? t???: <p>{dataDiscount.descDiscount}</p>
                </span>
                <span>
                  Ph???n tr??m gi???m: <p>{dataDiscount.percent * 100}%</p>
                </span>
              </div>
            </Card.Grid>
            <Card.Grid style={{ ...gridStyle, marginBottom: '20px' }}>
              <div className="container-select">
                <span>Ch???n s???n ph???m ??p d???ng: </span>
                <Select
                  mode="multiple"
                  showArrow
                  tagRender={tagRender}
                  style={{ width: '100%' }}
                  options={options}
                  onChange={selectProdOnchangeHandler}
                />
                <Button style={{ margin: '0 10px' }} onClick={() => btnOnlickHandler()}>
                  ??p d???ng
                </Button>
              </div>
            </Card.Grid>
            <Card.Grid style={{ ...gridStyle, marginBottom: '20px' }}>
              <div className="container-select">
                <span>Ch???n Category ????? ??p d???ng: </span>
                <Select
                  mode="multiple"
                  showArrow
                  tagRender={tagRender}
                  style={{ width: '100%' }}
                  options={optionsCate}
                  onChange={selectCateOnchangeHandler}
                />
                <Button style={{ margin: '0 10px' }} onClick={() => btnCateOnClick()}>
                  ??p d???ng
                </Button>

                <Popconfirm
                  title="B???n mu???n B??? ??p d???ng?"
                  onConfirm={() => btnRemoveCateOnClick()}
                >
                  <Button style={{ margin: '0 10px' }}>B??? ??p d???ng</Button>
                </Popconfirm>
              </div>
            </Card.Grid>
            {listProduct.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: '1.6rem',
                    margin: '0 0 20px 10px',
                    color: '#0b8235',
                  }}
                >
                  Nh???ng s???n ph???m ??ang ??p d???ng gi???m gi?? n??y
                </div>
                {listProduct.map((item, index) => (
                  <Card.Grid key={index} style={gridStyleProd}>
                    <div className="wapper-card-addtoproduct">
                      <Image
                        width={50}
                        height={50}
                        src={`${LINKIMG_BASE}${item.imgURL}.jpg?alt=media`}
                      />
                      <div className="card-addtoproduct_name">
                        <p>{item.nameProduct}</p>
                      </div>
                      <ButtonCustom style={{ padding: '0' }}>
                        <Popconfirm
                          title="B???n mu???n x??a?"
                          onConfirm={() =>
                            removeProdHandler({ idProduct: item.idProduct })
                          }
                        >
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            size="1x"
                            style={{ opacity: '0.8' }}
                          />
                        </Popconfirm>
                      </ButtonCustom>
                    </div>
                  </Card.Grid>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default AddToProduct;
