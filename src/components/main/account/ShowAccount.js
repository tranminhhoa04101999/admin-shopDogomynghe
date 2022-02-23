import React from 'react';
import './ShowAccount.css';
import { Table, notification, Popconfirm, Image, Card, Input, Space, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { storage } from '../../../firebase';
import { ref, deleteObject } from 'firebase/storage';
import { LINKCONECT_BASE, LINKIMG_BASE } from '../../../App';
import ButtonCustom from '../../base/ButtonCustom';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ShowAccount = () => {
  const [dataAccount, setDataAccount] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const navigate = useNavigate();

  const openNotificationWithIcon = (props) => {
    notification[props.type]({
      message: props.message,
      description: props.desc,
    });
  };
  useEffect(() => {
    // đưa state về rỗng trước khi reload trang
    setDataTable([]);
    setDataAccount([]);
    // lấy all product
    fetch(LINKCONECT_BASE + '/accounts')
      .then((responsive) => responsive.json())
      .then((data) => dataTableHandler(data))
      .catch((error) =>
        openNotificationWithIcon({
          type: 'error',
          message: 'Fetch thất bại',
          desc: error,
        })
      );
  }, []);

  const dataTableHandler = (data) => {
    setDataAccount(data);
    for (let i = 0; i < data.length; i++) {
      setDataTable((prevData) => [
        ...prevData,
        {
          key: data[i].idAccount,
          idAccount: data[i].idAccount,
          email: data[i].email,
          password: data[i].password,
          roleName: data[i].role.roleName,
          role: data[i].role,
          isActive: data[i].isActive === 1 ? 'Hoạt động' : 'Dừng',
        },
      ]);
    }
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'idAccount',
      filterSearch: true,
      width: '5%',
    },

    {
      title: 'Email',
      dataIndex: 'email',
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
              placeholder="Nhập id cần tìm"
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
        return record.email.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: 'Password',
      dataIndex: 'password',
    },
    {
      title: 'Quyền tài khoản',
      dataIndex: 'roleName',
      width: '',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      render: (_, record) => actionBtn({ idAccount: record.key }),
      width: '10%',
    },
  ];

  const removeAccountHandler = (props) => {
    fetch(`${LINKCONECT_BASE}/deleteById?id=${props.idAccount}`, {
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
    })
      .then((data) => {
        openNotificationWithIcon({
          type: 'success',
          message: 'Xóa tài khoản thành công',
          desc: props.idAccount,
        });
      })
      .catch((error) => {
        openNotificationWithIcon({
          type: 'error',
          message: 'Xóa tài khoản thất bại',
          desc: error,
        });
      });
    //xóa thành công tự ra reload
    window.location.reload(false);
  };
  const editAccountHandler = (props) => {
    navigate('/account/editAccount', { state: { idAccount: props.idAccount } });
  };
  const actionBtn = (props) => {
    return (
      <div className="wraper-action">
        <ButtonCustom style={{ marginRight: '10px', padding: 0 }}>
          <Popconfirm
            title="bạn muốn sửa?"
            onConfirm={() => editAccountHandler({ idAccount: props.idAccount })}
          >
            <FontAwesomeIcon icon={faEdit} />
          </Popconfirm>
        </ButtonCustom>
        <ButtonCustom style={{ padding: 0 }}>
          <Popconfirm
            title="Bạn muốn xóa?"
            onConfirm={() => removeAccountHandler({ idAccount: props.idAccount })}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </Popconfirm>
        </ButtonCustom>
      </div>
    );
  };

  return (
    <Table
      columns={columns}
      dataSource={dataTable}
      expandable={{
        expandedRowRender: (record) => (
          <div className="wrapper-expan__product">
            {/* <Card
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
            </Card> */}
            {/* <div style={{ marginBottom: '4px' }}>
              <ButtonCustom
                style={{ fontSize: '1.5rem' }}
                onClick={() => loadImgHandler({ idProd: record.key })}
              >
                Hiển thị ảnh
              </ButtonCustom>
            </div>
            <div>{imgProd.length > 0 ? ShowAnh : <div></div>}</div> */}
          </div>
        ),
        rowExpandable: (record) => record.name !== 'Not Expandable',
      }}
    />
  );
};

export default ShowAccount;
