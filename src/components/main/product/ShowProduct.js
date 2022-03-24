import React, { useEffect, useState } from 'react';
import './ShowProduct.css';
import { Table, notification, Popconfirm, Image, Card, Input, Space, Button } from 'antd';
import { LINKCONECT_BASE, LINKIMG_BASE } from '../../../App';
import ButtonCustom from '../../base/ButtonCustom';
import { faEdit, faTrashAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import { storage } from '../../../firebase';
import { ref, deleteObject } from 'firebase/storage';
import moment from 'moment';

const ShowProduct = () => {
  const [dataProd, setDataProd] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expaned, setExpaned] = useState([]);
  const [imgProd, setImgProd] = useState([
    {
      idImgProduct: 0,
      imgURL: 'defaultImage',
    },
  ]);
  const navigate = useNavigate();

  const removeHandler = async (props) => {
    const idProd = props.id;
    let checkHaveOrdersItem = -1;
    await fetch(`${LINKCONECT_BASE}/checkProductHaveOrderItems?idProduct=${idProd}`)
      .then((response) => response.json())
      .then((data) => (checkHaveOrdersItem = data));
    console.log('first', checkHaveOrdersItem);
    // xóa cả ảnh liên quan database
    if (checkHaveOrdersItem === 0) {
      await fetch(LINKCONECT_BASE + `/deleteImgByIdProduct?idProduct=${idProd}`, {
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
      })
        .then((response) => response)
        .then((data) => {
          // xóa thành công reload component
          // window.location.reload(false);
        })
        .catch((error) => {
          openNotificationWithIcon({
            type: 'error',
            message: 'Xóa imgproduc thất bại',
            desc: error,
          });
        });
      // xoa prodcut database
      await fetch(LINKCONECT_BASE + `/deleteproduct?idProd=${idProd}`, {
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
      })
        .then((response) => response)
        .then((data) => {
          openNotificationWithIcon({
            type: 'success',
            message: 'Xóa thành công',
            desc: 'Id: ' + idProd,
          });
        })
        .catch((error) => {
          openNotificationWithIcon({
            type: 'error',
            message: 'Xóa thất bại',
            desc: error,
          });
          return;
        });
      var dataImgRemove = [];
      // xóa cả ảnh liên quan firebase
      // lay ra imgremove theo idprodc
      await fetch(`http://localhost:8080/imgproductwith?idProduct=${idProd}`)
        .then((response) => response.json())
        .then((data) => (dataImgRemove = data));
      console.log('dataImgRemove', dataImgRemove);
      if (dataImgRemove.length !== 0) {
        dataImgRemove.map((item) => {
          if (item.imgURL !== 'defaultImage') {
            const desertRef = ref(storage, `images/${item.imgURL}.jpg`);
            deleteObject(desertRef)
              .then(() => {
                console.log('xoa anh thanh cong');
              })
              .catch((error) => {
                console.log('xoa anh that bai');
                // Uh-oh, an error occurred!
              });
          }
        });
      }
      window.location.reload(false);
    } else {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Xóa thất bại',
        desc: 'Sản phẩm này đã được đặt hàng! chỉ được set active',
      });
    }
  };

  const editHandler = (props) => {
    navigate('/products/editproduct', { state: { idProd: props.id } });
  };

  const actionBtn = (props) => {
    return (
      <div className="wraper-action">
        <ButtonCustom style={{ marginRight: '10px', padding: 0 }}>
          <Popconfirm
            title="bạn muốn sửa?"
            onConfirm={() => editHandler({ id: props.idProd })}
          >
            <FontAwesomeIcon icon={faEdit} />
          </Popconfirm>
        </ButtonCustom>
        <ButtonCustom style={{ padding: 0 }}>
          <Popconfirm
            title="Bạn muốn xóa?"
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
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        return (
          <div>
            <Input
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
              }}
              autoFocus
              placeholder="Nhập tên cần tìm"
            />
            <Space>
              <Button
                type="primary"
                onClick={() => confirm()}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={() => {
                  clearFilters();
                  confirm();
                }}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </Space>
          </div>
        );
      },
      filterIcon: <SearchOutlined />,
      onFilter: (value, record) => {
        return record.nameProduct.toLowerCase().includes(value.toLowerCase());
      },
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
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Ngày thêm',
      dataIndex: 'addDate',
      render: (record) => moment(record.addDate).format('DD/MM/YYYY'),
    },
    {
      title: 'Thể loại',
      dataIndex: 'nameCategory',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      render: (_, record) => actionBtn({ idProd: record.key }),
      width: '8%',
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
          category: data[i].category,
          nameCategory: data[i].category.name,
          discount: data[i].discount,
        },
      ]);
    }
  };

  useEffect(() => {
    setLoading(true);
    // đưa state về rỗng trước khi reload trang
    setDataProd([]);
    setDataTable([]);
    // lấy all product
    fetch(LINKCONECT_BASE + '/allproduct')
      .then((responsive) => responsive.json())
      .then((data) => {
        dataTableHandler(data);
        setLoading(false);
      })
      .catch((error) => {
        openNotificationWithIcon({
          type: 'error',
          message: 'Fetch thất bại',
          desc: error,
        });
        setLoading(false);
      });
    // lấy hình ảnh của product
  }, []);

  var ShowAnh = <div></div>;
  if (imgProd.length !== 0) {
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
    <div>
      {!loading ? (
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
                  <p>
                    Tên: {record.discount === null ? '' : record.discount.nameDiscount}
                  </p>
                  <p>
                    Miêu Tả:{' '}
                    {record.discount === null ? '' : record.discount.descDiscount}
                  </p>
                  <p>
                    Phần Trăm:{' '}
                    {record.discount === null ? '' : record.discount.percent * 100} %
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
            onExpand: (expanded, record) => {
              if (expanded) {
                setExpaned([record.key]);
              } else {
                setExpaned([]);
              }
            },
          }}
          expandedRowKeys={expaned}
        />
      ) : (
        <div className="container-loading">
          <FontAwesomeIcon icon={faSpinner} size="1x" className="loading" />
          <div>Loading....</div>
        </div>
      )}
    </div>
  );
};

export default ShowProduct;
