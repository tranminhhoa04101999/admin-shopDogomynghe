import React from 'react';
import './ShowOrders.css';
import ButtonCustom from '../../base/ButtonCustom';
import { Table, notification, Popconfirm, Image, Card, Input, Space, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LINKCONECT_BASE, LINKIMG_BASE } from '../../../App';
import moment from 'moment';

const gridStyle = {
  width: 'calc(100% /3 )',
  textAlign: 'center',
  padding: '10px',
};

const ShowOrders = () => {
  const [dataTable, setDataTable] = useState([]);
  const [dataOrders, setDataOrders] = useState([]);
  const [dataOrderExpan, setDataOrderExpan] = useState(null);
  const openNotificationWithIcon = (props) => {
    notification[props.type]({
      message: props.message,
      description: props.desc,
    });
  };
  const navigate = useNavigate();
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
  });
  useEffect(() => {
    fetch(`${LINKCONECT_BASE}/allorder`)
      .then((response) => response.json())
      .then((data) => {
        setDataOrders(data);
        data.map((item) =>
          setDataTable((prev) => [
            ...prev,
            {
              key: item.idOrder,
              idOrder: item.idOrder,
              phone: item.phone,
              name: item.customer.name,
              address: item.address,
              note: item.note,
              total: item.total,
              dateCreate: item.dateCreate,
              dateModified: item.dateModified,
              dateEnd: item.dateEnd,
              statusName: item.status.statusName,
            },
          ])
        );
      });
    return () => {
      setDataTable([]);
    };
  }, []);

  const EditActionHandler = (props) => {
    navigate('/orders/editorders', { state: { idOrder: props.idOrder } });
  };

  const actionBtn = (props) => {
    return (
      <div className="wraper-action">
        <ButtonCustom style={{ marginRight: '10px', padding: 0 }}>
          <Popconfirm
            title="bạn muốn sửa?"
            onConfirm={() => EditActionHandler({ idOrder: props.idOrder })}
          >
            <FontAwesomeIcon icon={faEdit} />
          </Popconfirm>
        </ButtonCustom>
      </div>
    );
  };
  const expanHandler = (props) => {
    fetch(
      `${LINKCONECT_BASE}/searchOrderByIdOrPhone?idStatus=6&idOrders=${props.idOrder}&phone=0`
    )
      .then((response) => response.json())
      .then((data) => setDataOrderExpan(data[0]));
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'idOrder',
    },

    {
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'address',
    },
    {
      title: 'Lưu ý',
      dataIndex: 'note',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      render: (_, record) => formatter.format(record.total),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'dateCreate',
      render: (_, record) => moment(record.dateCreate).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày chỉnh sửa',
      dataIndex: 'dateModified',
      render: (_, record) => moment(record.dateModified).format('DD/MM/YYYY'),
    },
    {
      title: 'Ngày hoàn thành',
      dataIndex: 'dataEnd',
      render: (_, record) =>
        record.dateEnd !== null ? moment(record.dateEnd).format('DD/MM/YYYY') : '',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'statusName',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      render: (_, record) => actionBtn({ idOrder: record.idOrder }),
      width: '5%',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataTable}
      expandable={{
        expandedRowRender: (record) => {
          if (dataOrderExpan !== null)
            return (
              <div>
                <Card>
                  {dataOrderExpan.productSearchResponses.map((item, index) => (
                    <Card.Grid key={index} style={gridStyle}>
                      <div className="wapper-card-showorder">
                        <Image
                          width={50}
                          height={50}
                          src={`${LINKIMG_BASE}${item.imgURL}.jpg?alt=media`}
                        />
                        <div className="card-showorder_name">
                          <p>{item.nameProduct}</p>
                          <p>x{item.quantity}</p>
                        </div>
                        <div className="card-showorder_price">
                          <div className="cart-table__wrap-price-old">
                            {formatter.format(item.price)}
                          </div>
                          <div className="cart-table__wrap-price-total">
                            Tổng tiền: {formatter.format(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </Card.Grid>
                  ))}
                </Card>
              </div>
            );
        },
        rowExpandable: (record) => record.name !== 'Not Expandable',

        onExpand: (expanded, record) => {
          if (expanded) {
            expanHandler({ idOrder: record.idOrder });
          }
        },
      }}
    />
  );
};

export default ShowOrders;
