import React from 'react';
import ButtonCustom from '../../base/ButtonCustom';
import { Table, notification, Popconfirm, Image, Card, Input, Space, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LINKCONECT_BASE, LINKIMG_BASE } from '../../../App';
import moment from 'moment';

const ShowOrders = () => {
  const [dataTable, setDataTable] = useState([]);
  const [dataOrders, setDataOrders] = useState([]);
  const [dataOrderExpan, setDataOrderExpan] = useState([]);
  const openNotificationWithIcon = (props) => {
    notification[props.type]({
      message: props.message,
      description: props.desc,
    });
  };
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

  const actionBtn = (props) => {
    return (
      <div className="wraper-action">
        <ButtonCustom style={{ marginRight: '10px', padding: 0 }}>
          <Popconfirm title="bạn muốn sửa?" onConfirm={() => {}}>
            <FontAwesomeIcon icon={faEdit} />
          </Popconfirm>
        </ButtonCustom>
        <ButtonCustom style={{ padding: 0 }}>
          <Popconfirm title="Bạn muốn xóa?" onConfirm={() => {}}>
            <FontAwesomeIcon icon={faTrashAlt} />
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
      .then((data) => setDataOrderExpan(data));
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'idOrder',
    },

    {
      title: 'Tên',
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
      render: (_, record) => actionBtn(),
      width: '8%',
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={dataTable}
      expandable={{
        expandedRowRender: (record) => {
          if (dataOrderExpan.length > 0)
            return <div>{dataOrderExpan[0].orders.phone}</div>;
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
