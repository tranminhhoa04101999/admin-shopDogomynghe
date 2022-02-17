import React, { useEffect, useState } from 'react';
import './ShowProduct.css';
import { Table, notification, Popconfirm, Image, Card } from 'antd';
import { LINKCONECT_BASE, LINKIMG_BASE } from '../../../App';
import ButtonCustom from '../../base/ButtonCustom';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ShowProduct = () => {
  const [dataProd, setDataProd] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [imgProd, setImgProd] = useState([
    {
      idImgProduct: 0,
      imgURL: '',
    },
  ]);

  const removeHandler = (props) => {
    const idProd = props.id;
    fetch(LINKCONECT_BASE + '/deleteproduct', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        // 'Content-Type': 'application/json',
        Accepts: '*/*',

        'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: `idProd=${idProd}`,
    })
      .then((response) => response)
      .then((data) => {
        openNotificationWithIcon({
          type: 'success',
          message: 'Xóa thành công',
          desc: 'Id: ' + idProd,
        });
        // xóa thành công reload component
        window.location.reload(false);
      })
      .catch((error) => {
        openNotificationWithIcon({
          type: 'error',
          message: 'Xóa thất bại',
          desc: error,
        });
      });
  };

  const actionBtn = (props) => {
    return (
      <div className="wraper-action">
        <ButtonCustom style={{ marginRight: '10px', padding: 0 }} onClick={() => {}}>
          <FontAwesomeIcon icon={faEdit} />
        </ButtonCustom>
        <ButtonCustom style={{ padding: 0 }}>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => removeHandler({ id: props.idProd })}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </Popconfirm>
        </ButtonCustom>
      </div>
    );
  };
  const columns = [
    {
      title: 'Tên',
      dataIndex: 'nameProduct',
      filterSearch: true,
      filterMode: 'tree',
      width: '20%',
    },

    {
      title: 'Giá',
      dataIndex: 'price',
    },
    {
      title: 'Màu',
      dataIndex: 'color',
    },
    {
      title: 'Miêu tả',
      dataIndex: 'descProduct',
      width: '20%',
    },
    {
      title: 'Số Lượng còn',
      dataIndex: 'quantity',
    },
    {
      title: 'Ngày thêm',
      dataIndex: 'addDate',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      render: (_, record) => actionBtn({ idProd: record.key }),
      width: '10%',
    },
  ];

  const openNotificationWithIcon = (props) => {
    notification[props.type]({
      message: props.message,
      description: props.desc,
    });
  };

  const dataTableHandler = (data) => {
    setDataProd(data);

    for (let i = 0; i < data.length; i++) {
      setDataTable((prevData) => [
        ...prevData,
        {
          key: data[i].idProduct,
          nameProduct: data[i].nameProduct,
          price: data[i].price,
          color: data[i].color,
          descProduct: data[i].descProduct,
          quantity: data[i].quantity,
          addDate: data[i].addDate,
          isActive: data[i].isActive === 1 ? 'Đang bán' : 'Dừng',
          discount: data[i].discount,
        },
      ]);
    }
  };

  useEffect(() => {
    // đưa state về rỗng trước khi reload trang
    setDataProd([]);
    setDataTable([]);
    // lấy all product
    fetch(LINKCONECT_BASE + '/allproduct')
      .then((responsive) => responsive.json())
      .then((data) => dataTableHandler(data))
      .catch((error) =>
        openNotificationWithIcon({
          type: 'error',
          message: 'Fetch thất bại',
          desc: error,
        })
      );
    // lấy hình ảnh của product
  }, []);

  var ShowAnh = <div></div>;
  if (imgProd[0].imgURL !== '') {
    ShowAnh = imgProd.map((item) => (
      <Image
        key={item.idImgProduct}
        width={100}
        height={100}
        src={`${LINKIMG_BASE}${item.imgURL}.jpg?alt=media`}
      />
    ));
  }

  const loadImgHandler = (props) => {
    const idProd = props.idProd;
    fetch(LINKCONECT_BASE + `/imgproductwith?idProduct=${idProd}`)
      .then((responsive) => responsive.json())
      .then((data) => setImgProd(data))
      .catch((error) =>
        openNotificationWithIcon({
          type: 'error',
          message: 'Fetch thất bại',
          desc: error,
        })
      );
  };

  return (
    <Table
      columns={columns}
      dataSource={dataTable}
      expandable={{
        expandedRowRender: (record) => (
          <div className="wrapper-expan__product">
            <Card
              title="Giảm Giá"
              bordered={false}
              style={{ width: 200, marginRight: '8px' }}
              className="discount-card__product"
            >
              <p>Tên: {record.discount === null ? '' : record.discount.nameDiscount}</p>
              <p>
                Miêu Tả: {record.discount === null ? '' : record.discount.descDiscount}
              </p>
              <p>
                Phần Trăm: {record.discount === null ? '' : record.discount.percent * 100}{' '}
                %
              </p>
            </Card>
            <div style={{ marginBottom: '4px' }}>
              <ButtonCustom
                style={{ fontSize: '1.5rem' }}
                onClick={() => loadImgHandler({ idProd: record.key })}
              >
                Hiển thị ảnh
              </ButtonCustom>
            </div>
            <div>{imgProd.length > 0 ? ShowAnh : <div></div>}</div>
          </div>
        ),
        rowExpandable: (record) => record.name !== 'Not Expandable',
      }}
    />
  );
};

export default ShowProduct;
