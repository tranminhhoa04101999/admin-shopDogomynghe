import React from 'react';
import './ShowCategory.css';
import ButtonCustom from '../../base/ButtonCustom';
import { Table, notification, Popconfirm, Image, Card, Input, Space, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LINKCONECT_BASE, LINKIMG_BASE } from '../../../App';
import { storage } from '../../../firebase';
import { ref, deleteObject } from 'firebase/storage';

const ShowCategory = () => {
  const navigate = useNavigate();
  const [dataTable, setDataTable] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);
  const openNotificationWithIcon = (props) => {
    notification[props.type]({
      message: props.message,
      description: props.desc,
    });
  };

  useEffect(() => {
    // get all category
    fetch(`${LINKCONECT_BASE}/allcategory`)
      .then((response) => response.json())
      .then((data) => {
        setDataCategory(data);
        //set data table
        for (let i = 0; i < data.length; i++) {
          const count = 0;
          // set số lượng sản phẩm có trong loại đó
          fetch(`${LINKCONECT_BASE}/allquantityby?idCategory=${data[i].idCategory}`)
            .then((response) => response.json())
            .then((data1) => {
              setDataTable((prevData) => [
                ...prevData,
                {
                  key: data[i].idCategory,
                  idCategory: data[i].idCategory,
                  name: data[i].name,
                  imgURL: data[i].imgURL,
                  descCategory: data[i].descCategory,
                  quantityProduct: data1,
                  isActive: data[i].isActive === 1 ? 'Đang bán' : 'Dừng',
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
    navigate('/category/editcategory', { state: { data: props.data } });
  };
  const removeHandler = (props) => {
    fetch(`${LINKCONECT_BASE}/deletecategoryBy?idCategory=${props.data.idCategory}`, {
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
      .then((response) => response.json())
      .then((data) =>
        openNotificationWithIcon({
          type: 'success',
          message: 'Xóa thành công',
          desc: 'Sản phẩm có Id: ' + props.data.idCategory,
        })
      )
      .catch((error) =>
        openNotificationWithIcon({
          type: 'success',
          message: 'Xóa thành công',
          desc: 'Sản phẩm có Id: ' + props.data.idCategory,
        })
      );
    //xoa hinh trne firebase
    const desertRef = ref(storage, `images/${props.data.imgURL}.jpg`);
    deleteObject(desertRef)
      .then(() => {
        console.log('xoa anh thanh cong');
      })
      .catch((error) => {
        console.log('xoa anh that bai');
        // Uh-oh, an error occurred!
      });
    window.location.reload(false);
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
        <ButtonCustom style={{ padding: 0 }}>
          <Popconfirm
            title="Bạn muốn xóa?"
            onConfirm={() => removeHandler({ data: props.data })}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </Popconfirm>
        </ButtonCustom>
      </div>
    );
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'idCategory',
    },

    {
      title: 'Tên Loại',
      dataIndex: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'descCategory',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      render: (_, record) => (
        <Image
          width={60}
          height={60}
          src={`${LINKIMG_BASE}${record.imgURL}.jpg?alt=media`}
        />
      ),
    },
    {
      title: 'Số lượng sản phẩm',
      dataIndex: 'quantityProduct',
      width: '10%',
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

export default ShowCategory;
