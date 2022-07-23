import React from 'react';
import './ShowImport.css';
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

const ShowImport = () => {
  const [dataTable, setDataTable] = useState([]);
  const [dataExpan, setDataExpan] = useState(null);
  const [expaned, setExpaned] = useState([]);

  useEffect(() => {
    fetch(`${LINKCONECT_BASE}/importProducts`)
      .then((response) => response.json())
      .then((data) => {
        data.map((item) => {
          fetch(
            `${LINKCONECT_BASE}/detailsfindbyimportprod?idImportProduct=${item.idImportProduct}`
          )
            .then((response) => response.json())
            .then((data1) =>
              setDataTable((prev) => [
                ...prev,
                {
                  key: item.idImportProduct,
                  idImportProduct: item.idImportProduct,
                  sourceName: item.sourceName,
                  dateCreate: item.dateCreate,
                  dateModified: item.dateModified,
                  nameEmployee: item.employee.name,
                  total: data1.reduce((prev, cur) => prev + cur.price * cur.quantity, 0),
                },
              ])
            );
        });
      });
    return () => {
      setDataTable([]);
    };
  }, []);
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

  const exportReceipt = (props) => {
    fetch(`${LINKCONECT_BASE}/exportreceiptimport?idImportProduct=${props.id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data === 1) {
          openNotificationWithIcon({
            type: 'success',
            message: '',
            desc: 'Xuất File thành công !!!',
          });
        } else {
          openNotificationWithIcon({
            type: 'error',
            message: '',
            desc: 'Xuất File thất bại !!!',
          });
        }
      });
  };
  const editImportHandler = async (props) => {
    let listId = [];
    let nameEmployee = '';
    await fetch(`${LINKCONECT_BASE}/detailsfindbyimportprod?idImportProduct=${props.id}`)
      .then((response) => response.json())
      .then((data) => {
        data.map((item) => {
          listId.push(item.product.idProduct);
        });
        nameEmployee = data[0].importProduct.employee.name;
      });
    navigate('/importproduct/editimport', {
      state: { id: props.id, listIdProd: listId, nameEmployee: nameEmployee },
    });
  };

  const actionBtn = (props) => {
    return (
      <div className="wraper-action">
        <ButtonCustom style={{ marginRight: '10px', padding: 0 }}>
          <Popconfirm
            title="Chỉnh sửa"
            onConfirm={() => editImportHandler({ id: props.idImportProduct })}
          >
            <FontAwesomeIcon icon={faEdit} />
          </Popconfirm>
        </ButtonCustom>
        <ButtonCustom style={{ marginRight: '10px', padding: 0 }}>
          <Popconfirm
            title="xuất hóa đơn"
            onConfirm={() => exportReceipt({ id: props.idImportProduct })}
          >
            <FontAwesomeIcon icon={faFileInvoice} />
          </Popconfirm>
        </ButtonCustom>
      </div>
    );
  };

  const columns = [
    {
      title: 'Mã PN',
      dataIndex: 'idImportProduct',
    },
    {
      title: 'Tên nguồn nhập',
      dataIndex: 'sourceName',
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
        return record.sourceName.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: 'Ngày nhập',
      dataIndex: 'dateCreate',
    },
    {
      title: 'Ngày chỉnh sửa',
      dataIndex: 'dateModified',
    },
    {
      title: 'Nhân viên nhập',
      dataIndex: 'nameEmployee',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      render: (_, record) => formatter.format(record.total),
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      render: (_, record) => actionBtn({ idImportProduct: record.idImportProduct }),
    },
  ];

  const ExpanHandler = (props) => {
    fetch(
      `${LINKCONECT_BASE}/detailsfindbyimportprod?idImportProduct=${props.idImportProduct}`
    )
      .then((response) => response.json())
      .then((data1) => setDataExpan(data1));
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataTable}
        expandable={{
          expandedRowRender: (record) => {
            if (dataExpan !== null)
              return (
                <div>
                  <Card>
                    {dataExpan.map((item, index) => (
                      <Card.Grid key={index} style={gridStyle}>
                        <div className="wrapper-card_showdetails">
                          <div className="card_showdetails-head">
                            Mã SP: <span>{item.product.idProduct}</span>
                            <span>{item.product.nameProduct}</span>
                          </div>
                          <div className="card_showdetails-center">
                            <div className="showdetails-center_quantity">
                              Số Lượng: <span>{item.quantity}</span>
                            </div>
                            <div className="showdetails-center_price">
                              Giá nhập: <span>{formatter.format(item.price)}</span>
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
              ExpanHandler({ idImportProduct: record.idImportProduct });
              setExpaned([record.idImportProduct]);
            } else {
              setExpaned([]);
            }
          },
        }}
        expandedRowKeys={expaned}
      />
    </div>
  );
};

export default ShowImport;
