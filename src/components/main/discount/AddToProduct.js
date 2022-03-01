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
  const [listIdProduct, setListIdProduct] = useState([]);
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
  const btnOnlickHandler = () => {
    if (listIdProduct.length === 0) {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Bạn chưa chọn sản phẩm để áp dụng',
        desc: 'Chọn đi nào',
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
              message: 'Thành công',
              desc: 'Áp dụng giảm giá thành công',
            });
            setReload(1);
          }
          if (data === 0) {
            openNotificationWithIcon({
              type: 'error',
              message: 'Thất bại',
              desc: 'Áp dụng thất bại',
            });
          }
        })
        .catch((error) =>
          openNotificationWithIcon({
            type: 'error',
            message: 'Áp dụng thất bại',
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
            message: 'Thành công',
            desc: 'Xóa sản phẩm ' + props.idProduct + ' khỏi giảm giá này',
          });
          setReload(1);
        }
        if (data === 0) {
          openNotificationWithIcon({
            type: 'error',
            message: 'Thất bại',
            desc: 'Xóa sản phẩm khỏi giảm giá này thất bại',
          });
        }
      })
      .catch((error) =>
        openNotificationWithIcon({
          type: 'error',
          message: 'Xóa sản phẩm khỏi giảm giá này thất bại',
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
                  Tên giảm giá: <p>{dataDiscount.nameDiscount}</p>
                </span>
                <span>
                  Mô tả: <p>{dataDiscount.descDiscount}</p>
                </span>
                <span>
                  Phần trăm giảm: <p>{dataDiscount.percent * 100}%</p>
                </span>
              </div>
            </Card.Grid>
            <Card.Grid style={{ ...gridStyle, marginBottom: '20px' }}>
              <div className="container-select">
                <span>Chọn sản phẩm áp dụng: </span>
                <Select
                  mode="multiple"
                  showArrow
                  tagRender={tagRender}
                  style={{ width: '100%' }}
                  options={options}
                  onChange={selectProdOnchangeHandler}
                />
                <Button style={{ margin: '0 10px' }} onClick={() => btnOnlickHandler()}>
                  Áp dụng
                </Button>
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
                  Những sản phẩm đang áp dụng giảm giá này
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
                          title="Bạn muốn xóa?"
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
