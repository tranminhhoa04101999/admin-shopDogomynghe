import React from 'react';
import './ShowDiscount.css';
import ButtonCustom from '../../base/ButtonCustom';
import { Table, notification, Popconfirm } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LINKCONECT_BASE } from '../../../App';

const ShowDiscount = () => {
  const navigate = useNavigate();
  const [dataTable, setDataTable] = useState([]);
  const [reload, setReload] = useState(0);
  const [dataDiscount, setDataDiscount] = useState([]);
  const openNotificationWithIcon = (props) => {
    notification[props.type]({
      message: props.message,
      description: props.desc,
    });
  };

  useEffect(() => {
    // get all discount
    fetch(`${LINKCONECT_BASE}/alldiscount`)
      .then((response) => response.json())
      .then((data) => {
        setDataDiscount(data);
        //set data table
        for (let i = 0; i < data.length; i++) {
          const count = 0;
          // set số lượng sản phẩm được áp dụng giảm giá này
          fetch(
            `${LINKCONECT_BASE}/allquantitybyIdDiscount?idDiscount=${data[i].idDiscount}`
          )
            .then((response) => response.json())
            .then((data1) => {
              setDataTable((prevData) => [
                ...prevData,
                {
                  key: data[i].idDiscount,
                  idDiscount: data[i].idDiscount,
                  nameDiscount: data[i].nameDiscount,
                  percent: data[i].percent,
                  percentShow: data[i].percent * 100 + '%',
                  descDiscount: data[i].descDiscount,
                  dateCreate: data[i].dateCreate,
                  dateModified: data[i].dateModified,
                  quantityProduct: data1,
                  isActive: data[i].isActive === 1 ? 'Áp dụng' : 'Dừng áp dụng',
                  data: data[i],
                },
              ]);
            });
        }
      });
    return () => {
      setDataTable([]);
    };
  }, []);

  const editHandler = (props) => {
    navigate('/discount/editdiscount', { state: { data: props.data } });
  };
  const removeHandler = async (props) => {
    // update product đưa idDiscount về null trước khi xóa discount đó
    await fetch(
      `${LINKCONECT_BASE}/updateIdDiscountWhenRemoveDiscount?idDiscount=${props.data.idDiscount}`,
      {
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
      }
    )
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) =>
        openNotificationWithIcon({
          type: 'success',
          message: 'update idDiscount ở product thất bài',
          desc: 'set idDiscount ở product áp dụng discount đó về null thất bại',
        })
      );

    // xóa discount db
    await fetch(
      `${LINKCONECT_BASE}/deleleByidDiscount?idDiscount=${props.data.idDiscount}`,
      {
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
      }
    )
      .then((response) => response.json())
      .then((data) =>
        openNotificationWithIcon({
          type: 'success',
          message: 'Xóa thành công',
          desc: 'Sản phẩm có Id: ' + props.data.idDiscount,
        })
      )
      .catch((error) =>
        openNotificationWithIcon({
          type: 'success',
          message: 'Xóa thành công',
          desc: 'Sản phẩm có Id: ' + props.data.idDiscount,
        })
      );
    window.location.reload(false);
  };
  const addToProductHandler = (props) => {
    if (props.data.isActive === 0) {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Không thể áp dụng discount!',
        desc: 'Discount đang dừng áp dụng.',
      });
    } else navigate('/discount/addToProduct', { state: { data: props.data } });
  };

  const actionBtn = (props) => {
    return (
      <div className="wraper-action">
        <ButtonCustom style={{ marginRight: '10px', padding: 0 }}>
          <Popconfirm
            title="bạn muốn sửa?"
            onConfirm={() => editHandler({ data: props.data })}
          >
            <FontAwesomeIcon icon={faEdit} />
          </Popconfirm>
        </ButtonCustom>
        <ButtonCustom style={{ padding: 0, marginRight: '10px' }}>
          <Popconfirm
            title="Bạn muốn xóa?"
            onConfirm={() => removeHandler({ data: props.data })}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </Popconfirm>
        </ButtonCustom>
        <ButtonCustom style={{ padding: 0 }}>
          <Popconfirm
            title="Bạn muốn áp dụng?"
            onConfirm={() => addToProductHandler({ data: props.data })}
          >
            <FontAwesomeIcon icon={faClipboardCheck} />
          </Popconfirm>
        </ButtonCustom>
      </div>
    );
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'idDiscount',
    },

    {
      title: 'Tên',
      dataIndex: 'nameDiscount',
    },
    {
      title: 'Mô tả',
      dataIndex: 'descDiscount',
    },
    {
      title: 'Phần trăm giảm',
      dataIndex: 'percentShow',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'dateCreate',
      width: '10%',
    },
    {
      title: 'Ngày sửa',
      dataIndex: 'dateModified',
      width: '10%',
    },
    {
      title: 'Số lượng sản phẩm đang áp dụng',
      dataIndex: 'quantityProduct',
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      width: '10%',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      render: (_, record) => actionBtn({ data: record.data }),
      width: '8%',
    },
  ];

  return <Table columns={columns} dataSource={dataTable} />;
};

export default ShowDiscount;
