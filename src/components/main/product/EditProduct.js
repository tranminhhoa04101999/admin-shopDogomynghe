import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './EditProduct.css';
import { Switch, Image, Button, Select } from 'antd';
import ButtonCustom from '../../base/ButtonCustom';
import { LINKCONECT_BASE, LINKIMG_BASE } from '../../../App';
import { notification } from 'antd';
import InputCustom from '../../base/InputCustom';
import { storage } from '../../../firebase';
import { ref, deleteObject } from 'firebase/storage';

const EditProduct = () => {
  const { state } = useLocation();
  const [img, setImg] = useState(null);
  const [idProd, setIdProd] = useState(0);
  const [imgURL, setImgURL] = useState(['']);
  const [imgDefaultProd, setImgDefaultProd] = useState([]);
  const [imgRemoveProd, setimgRemoveProd] = useState([]);
  const { Option } = Select;

  const [dataCategory, setDataCategory] = useState([
    {
      idCategory: 0,
      name: 'deafault',
      desc: null,
      imgURL: 'defaultImage',
      isActive: 1,
    },
  ]);
  const [dataProd, setDataProd] = useState({
    idProduct: 0,
    nameProduct: '',
    price: 0,
    color: '',
    descProduct: '',
    quantity: 0,
    addDate: new Date(),
    isActive: 1,
    category: null,
    discount: null,
  });

  // tạo giá trị ban đầu lấy qua edit hiển thị
  useEffect(() => {
    if (state !== null) {
      setIdProd(state.idProd);
      // lấy dữ liệu product
      fetch(`http://localhost:8080/getproductbyid?idProduct=${state.idProd}`)
        .then((responsive) => responsive.json())
        .then((data) => {
          let dataEdit = data;
          if (dataEdit.descProduct === null) {
            dataEdit.descProduct = '';
          }
          setDataProd(dataEdit);
        });
      // lấy dữ liệu hình ảnh của product
      fetch(`http://localhost:8080/imgproductwith?idProduct=${state.idProd}`)
        .then((responsive) => responsive.json())
        .then((data) => {
          setImgDefaultProd(data);
        });
      //lấy category all
      fetch(`${LINKCONECT_BASE}/allcategory`)
        .then((response) => response.json())
        .then((data) => setDataCategory(data));
    }
  }, []);
  const openNotificationWithIcon = (props) => {
    notification[props.type]({
      message: props.message,
      description: props.desc,
    });
  };

  const nameProdOnchange = (event) => {
    setDataProd((prevData) => ({ ...prevData, nameProduct: event.target.value }));
  };
  const priceProdOnchange = (event) => {
    setDataProd((prevData) => ({ ...prevData, price: event.target.value }));
  };
  const colorProdOnchange = (event) => {
    setDataProd((prevData) => ({ ...prevData, color: event.target.value }));
  };
  const descProdOnchange = (event) => {
    setDataProd((prevData) => ({ ...prevData, descProduct: event.target.value }));
  };
  const quantityProdOnchange = (event) => {
    setDataProd((prevData) => ({ ...prevData, quantity: event.target.value }));
  };
  const switchHandler = (checked) => {
    if (checked) {
      setDataProd((prevData) => ({ ...prevData, isActive: 1 }));
    } else {
      setDataProd((prevData) => ({ ...prevData, isActive: 0 }));
    }
  };
  const selectCategoryChangeHandler = (value) => {
    const categorySelect = dataCategory.find((item) => item.idCategory === value);
    setDataProd((prevData) => ({ ...prevData, category: categorySelect }));
  };

  const btnEditHandler = async (props) => {
    if (dataProd.nameProduct === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Vui lòng nhập tên sản phẩm',
      });
      return;
    } else if (dataProd.color === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Vui lòng nhập màu sản phẩm',
      });
      return;
    } else if (dataProd.quantity < 0) {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi số lượng',
        desc: 'Số lượng không thể nhỏ hơn 0',
      });
      return;
    }
    // sửa product
    await fetch(LINKCONECT_BASE + '/addproduct', {
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
      body: JSON.stringify(dataProd),
    })
      .then((response) => response)
      .then((data) => {
        openNotificationWithIcon({
          type: 'success',
          message: 'Thay đổi thành công',
          desc: 'Sản phẩm có Id: ' + dataProd.idProduct,
        });
      })
      .catch((error) => {
        openNotificationWithIcon({
          type: 'error',
          message: 'Thay đổi thất bại',
          desc: error,
        });
      });
    // sửa ảnh
    // xóa ảnh trên database vs firebase
    handlerRemove();
    handlerUpload();
  };

  const btnRemoveLocalImgHandler = (props) => {
    // tìm ra hình hiển thị
    const indexRemove = imgDefaultProd.findIndex(
      (item) => item.idImgProduct === props.idImg
    );
    const dataNew = [];
    imgDefaultProd.map((item, index) => {
      if (index !== indexRemove) {
        dataNew.push(item);
      } else {
        // tìm ra hình cần xóa
        setimgRemoveProd((prevData) => [...prevData, item]);
      }
    });
    setImgDefaultProd(dataNew);
  };
  const handlerChange = (event) => {
    setImgURL([]);
    if (event.target.files[0]) {
      setImg(event.target.files); //set mutiple file iamge
      var datas = event.target.files;
      var datasArray = Array.from(datas);

      datasArray.map((data) =>
        setImgURL((prevData) => [...prevData, URL.createObjectURL(data)])
      );
    } else {
      setImgURL(['']);
    }
  };

  const handlerUpload = () => {
    if (img !== null) {
      var size = Object.keys(img).length;
      for (let i = 0; i < size; i++) {
        //upload len firebase

        const uploadTask = storage.ref(`images/${img[i].name}`).put(img[i]);
        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            console.log(error);
            return;
          },
          () => {
            storage
              .ref('images')
              .child(img[i].name)
              .getDownloadURL()
              .then((url) => {
                console.log(url);
              });
          }
        );
        // upload ten anh len database theo id prodc dang sua
        let urlAdddb = img[i].name.substring(0, img[i].name.indexOf('.jpg'));
        fetch(
          `http://localhost:8080/saveimageproduct?imgURL=${urlAdddb}&idProduct=${idProd}`,
          {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              Accepts: '*/*',

              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )
          .then((response) => response)
          .then(
            (data) => {} //console.log(data)
          );
      }
    }
  };

  const handlerRemove = () => {
    if (imgRemoveProd.length !== 0) {
      imgRemoveProd.map((item) => {
        //xoa tren firebase

        const desertRef = ref(storage, `images/${item.imgURL}.jpg`);
        deleteObject(desertRef)
          .then(() => {
            console.log('xoa anh thanh cong');
          })
          .catch((error) => {
            console.log('xoa anh that bai');
            // Uh-oh, an error occurred!
          });

        // xoa tren db

        fetch(`http://localhost:8080/deleteImgById?idImgProduct=${item.idImgProduct}`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Accepts: '*/*',

            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
          .then((response) => response)
          .then(
            (data) => {} //console.log(data)
          );
      });
    }
  };

  return (
    <div className="wrap-editprod">
      <div className="wrap-editprod__item">
        <div className="addprod-input__ten">
          <InputCustom
            type="text"
            placeholder="Id sản phẩm"
            value={dataProd.idProduct}
            disabled={true}
            onChange={() => {}}
          />
          <div
            className={`addprod-input__ten-text ${
              dataProd.idProduct !== '' ? 'addprod-input__ten-text--active' : ''
            }`}
          >
            ID
          </div>
        </div>
        <div className="addprod-input__ten">
          <InputCustom
            type="text"
            placeholder="Tên sản phẩm"
            onChange={nameProdOnchange}
            value={dataProd.nameProduct}
          />
          <div
            className={`addprod-input__ten-text ${
              dataProd.nameProduct !== '' ? 'addprod-input__ten-text--active' : ''
            }`}
          >
            Tên
          </div>
        </div>
        <div className="addprod-input__ten">
          <InputCustom
            type="number"
            placeholder="Giá"
            onChange={priceProdOnchange}
            value={dataProd.price}
          />
          <div
            className={`addprod-input__ten-text ${
              dataProd.price !== '' ? 'addprod-input__ten-text--active' : ''
            }`}
          >
            Giá
          </div>
        </div>
        <div className="addprod-input__ten">
          <InputCustom
            type="text"
            placeholder="Màu"
            onChange={colorProdOnchange}
            value={dataProd.color}
          />
          <div
            className={`addprod-input__ten-text ${
              dataProd.color !== '' ? 'addprod-input__ten-text--active' : ''
            }`}
          >
            Màu
          </div>
        </div>
        <div className="addprod-input__ten">
          <InputCustom
            type="text"
            placeholder="Miêu tả"
            onChange={descProdOnchange}
            value={dataProd.descProduct}
          />
          <div
            className={`addprod-input__ten-text ${
              dataProd.descProduct !== '' ? 'addprod-input__ten-text--active' : ''
            }`}
          >
            Miêu tả
          </div>
        </div>
        <div className="addprod-input__ten">
          <InputCustom
            type="number"
            placeholder="Số lượng"
            onChange={quantityProdOnchange}
            value={dataProd.quantity}
          />
          <div
            className={`addprod-input__ten-text ${
              dataProd.descProduct !== '' ? 'addprod-input__ten-text--active' : ''
            }`}
          >
            Số lượng
          </div>
        </div>

        <div className="wrapper-product__category" style={{ marginBottom: '10px' }}>
          <span>Thể loại: </span>
          <Select
            value={
              dataProd.category !== null
                ? dataProd.category.idCategory
                : dataCategory[0].idCategory
            }
            style={{ width: 200 }}
            onChange={selectCategoryChangeHandler}
          >
            {dataCategory.map((item) => (
              <Option key={item.idCategory} value={item.idCategory}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
        <div className="wrap-imageDefault-edit">
          {imgDefaultProd.length !== 0
            ? imgDefaultProd.map((item) => (
                <div key={item.idImgProduct}>
                  <Image
                    width={100}
                    height={100}
                    src={`${LINKIMG_BASE}${item.imgURL}.jpg?alt=media`}
                  />
                  <Button
                    style={{ display: 'block' }}
                    onClick={() => btnRemoveLocalImgHandler({ idImg: item.idImgProduct })}
                  >
                    Xóa
                  </Button>
                </div>
              ))
            : ''}
        </div>
        {/* <div className="editprod-item__action wrapp-btn-upload">
          <ButtonUploadImg activeUpload={activeUpload} idMaxProduct={idProdMax} />
        </div> */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
          <div>
            <div className="btnuploadimg-wrap__input">
              <input type="file" onChange={handlerChange} multiple />
            </div>
            <div className="btnuploadimg-wrap__img">
              {imgURL.map((url, index) => (
                <Image width={100} height={url === '' ? 0 : 100} src={url} key={index} />
              ))}
            </div>
          </div>
        </div>

        <div className="editprod-item__action">
          <div className="editprod-item__Switch">
            <span>Mở Bán</span>
            <Switch
              checked={dataProd.isActive === 1 ? true : false}
              onChange={switchHandler}
            />
          </div>

          <div className="editprod-item__btn">
            <ButtonCustom
              style={{ backgroundColor: 'var(--color-btn-add)' }}
              onClick={() => btnEditHandler()}
            >
              Sửa sản phẩm
            </ButtonCustom>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
