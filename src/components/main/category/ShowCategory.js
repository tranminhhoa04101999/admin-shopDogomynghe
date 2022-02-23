import React from 'react';
import './ShowCategory.css';
import ButtonCustom from '../../base/ButtonCustom';
import { Table, notification, Popconfirm, Image, Card, Input, Space, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LINKCONECT_BASE, LINKIMG_BASE } from '../../../App';

const ShowCategory = () => {
  const navigate = useNavigate();
  const removeHandler = () => {};
  const [dataTable, setDataTable] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);

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
          <Popconfirm title="Bạn muốn xóa?" onConfirm={() => removeHandler()}>
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
  return (
    <Table
      columns={columns}
      dataSource={dataTable}
      // expandable={{
      //   expandedRowRender: (record) => (
      //     <div className="wrapper-expan__product">
      //       <Card
      //         title="Giảm Giá"
      //         bordered={false}
      //         style={{ width: 200, marginRight: '8px' }}
      //         className="discount-card__product"
      //       >
      //         <p>Tên: {record.discount === null ? '' : record.discount.nameDiscount}</p>
      //         <p>
      //           Miêu Tả: {record.discount === null ? '' : record.discount.descDiscount}
      //         </p>
      //         <p>
      //           Phần Trăm: {record.discount === null ? '' : record.discount.percent * 100}{' '}
      //           %
      //         </p>
      //       </Card>
      //       <div style={{ marginBottom: '4px' }}>
      //         <ButtonCustom
      //           style={{ fontSize: '1.5rem' }}
      //           onClick={() => loadImgHandler({ idProd: record.key })}
      //         >
      //           Hiển thị ảnh
      //         </ButtonCustom>
      //       </div>
      //       <div>{imgProd.length > 0 ? ShowAnh : <div></div>}</div>
      //     </div>
      //   ),
      //   rowExpandable: (record) => record.name !== 'Not Expandable',
      //}}
    />
  );
};

export default ShowCategory;
