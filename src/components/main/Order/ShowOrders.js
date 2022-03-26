import React from 'react';
import './ShowOrders.css';
import ButtonCustom from '../../base/ButtonCustom';
import { Table, notification, Popconfirm, Image, Card, Input, Space, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faFileExcel, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
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
  const [expaned, setExpaned] = useState([]);
  const [xuatFile, setXuatFile] = useState(false);

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
        data.map((item) => {
          fetch(`${LINKCONECT_BASE}/orderItemsfindByIdOrders?idOrders=${item.idOrder}`)
            .then((response) => response.json())
            .then((data1) =>
              setDataTable((prev) => [
                ...prev,
                {
                  key: item.idOrder,
                  idOrder: item.idOrder,
                  phone: item.phone,
                  name: item.customer.name,
                  address: item.address,
                  note: item.note,
                  total: data1.reduce(
                    (prev, cur) => prev + cur.priceCurrent * cur.quantity,
                    0
                  ),
                  dateCreate: item.dateCreate,
                  dateModified: item.dateModified,
                  dateEnd: item.dateEnd,
                  statusName: item.status.statusName,
                  idStatus: item.status.idStatus,
                },
              ])
            );
        });
      });
    return () => {
      setDataTable([]);
    };
  }, []);

  const EditActionHandler = (props) => {
    navigate('/orders/editorders', { state: { idOrder: props.idOrder } });
  };
  const xuathoadon = async (props) => {
    setXuatFile(true);
    const { idOrder } = props;
    await fetch(`${LINKCONECT_BASE}/xuatfilepdf?idOrder=${idOrder}`)
      .then((response) => response.json())
      .then((data) => {
        if (data === 1) {
          console.log('tao thanh cong');
        }
        if (data === 0) {
          console.log('tao that bai');
        }
      });
    setXuatFile(false);
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
        <ButtonCustom style={{ marginRight: '10px', padding: 0 }}>
          <Popconfirm
            title="xuất hóa đơn"
            onConfirm={() => xuathoadon({ idOrder: props.idOrder })}
          >
            <FontAwesomeIcon icon={faFileInvoice} />
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
      filterSearch: true,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => {
        return (
          <div style={{ width: '200px' }}>
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
              placeholder="Nhập sđt cần tìm"
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
        return record.phone.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'address',
      width: '30%',
    },
    {
      title: 'Lưu ý',
      dataIndex: 'note',
      width: '10%',
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
      filters: [
        {
          text: 'Đang đợi xử lý',
          value: 'Đang đợi xử lý',
        },
        {
          text: 'Đã tiếp nhận',
          value: 'Đã tiếp nhận',
        },
        {
          text: 'Đã thanh toán',
          value: 'Đã thanh toán',
        },
        {
          text: 'Đang giao',
          value: 'Đang giao',
        },
        {
          text: 'Đã giao',
          value: 'Đã giao',
        },
        {
          text: 'Đã hủy',
          value: 'Đã hủy',
        },
      ],

      onFilter: (value, record) => record.statusName.indexOf(value) === 0,
      sortDirections: ['descend'],
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      render: (_, record) => actionBtn({ idOrder: record.idOrder }),
      width: '8%',
    },
  ];

  return (
    <div>
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
                          <div className="card-showorder__leftexpan">
                            <Image
                              width={50}
                              height={50}
                              src={`${LINKIMG_BASE}${item.imgURL}.jpg?alt=media`}
                            />
                            <div className="card-showorder_name">
                              <p>{item.nameProduct}</p>
                              <p>x{item.quantity}</p>
                            </div>
                          </div>
                          <div className="card-showorder_price">
                            <div className="card-showorder_price-old">
                              {formatter.format(item.price)}
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
              setExpaned([record.idOrder]);
            } else {
              setExpaned([]);
            }
          },
        }}
        expandedRowKeys={expaned}
        rowClassName={(record, index) => {
          if (record.idStatus === 6) {
            return 'huy';
          } else if (record.idStatus === 5) {
            return 'hoanthanh';
          } else if (record.idStatus === 1) {
            return 'doixuly';
          } else if (record.idStatus === 2) {
            return 'datiepnhan';
          } else if (record.idStatus === 4) {
            return 'danggiao';
          }
        }}
      />
    </div>
  );
};

export default ShowOrders;
