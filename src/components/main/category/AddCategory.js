import React from 'react';
import './AddCategory.css';
import InputCustom from '../../base/InputCustom';
import { useState } from 'react';
import { Switch } from 'antd';
import ButtonCustom from '../../base/ButtonCustom';
import { LINKCONECT_BASE } from '../../../App';
import { notification, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { storage } from '../../../firebase';

const AddCategory = () => {
  const [imgURL, setImgURL] = useState(['']);
  const [img, setImg] = useState(null);
  const navigate = useNavigate();

  const [dataCategory, setDataCategory] = useState({
    name: '',
    descCategory: '',
    imgURL: 'defaultImage',
    isActive: 1,
  });

  const openNotificationWithIcon = (props) => {
    notification[props.type]({
      message: props.message,
      description: props.desc,
    });
  };

  const nameCateOnchange = (event) => {
    setDataCategory((prevData) => ({ ...prevData, name: event.target.value }));
  };

  const descCateOnchange = (event) => {
    setDataCategory((prevData) => ({ ...prevData, descCategory: event.target.value }));
  };

  const switchHandler = (checked) => {
    if (checked) {
      setDataCategory((prevData) => ({ ...prevData, isActive: 1 }));
    } else {
      setDataCategory((prevData) => ({ ...prevData, isActive: 0 }));
    }
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

  const btnSubmitHandler = () => {
    if (dataCategory.name === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Tên loại không được để trống',
      });
      return;
    } else if (dataCategory.descCategory === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Mô tả không được để trống',
      });
      return;
    }
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
        // upload category vao database
        let urlAdddb = img[i].name.substring(0, img[i].name.indexOf('.jpg'));
        let dataAdd = dataCategory;
        dataAdd.imgURL = urlAdddb;
        fetch(`${LINKCONECT_BASE}/saveCategory`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Accepts: '*/*',

            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: JSON.stringify(dataAdd),
        })
          .then((response) => response)
          .then((data) => {
            openNotificationWithIcon({
              type: 'success',
              message: 'Thêm mới thành công',
              desc: dataAdd.name,
            });
            navigate('/category/showcategory');
          })
          .catch((error) =>
            openNotificationWithIcon({
              type: 'error',
              message: 'Thêm mới thất bại',
              desc: error,
            })
          );
      }
    } else {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Hình ảnh không được để trống',
      });
      return;
    }
  };
  return (
    <div className="wrap-addcategory">
      <div className="wrap-addcategory__item">
        <div className="addprod-input__ten">
          <InputCustom
            type="text"
            placeholder="Tên loại"
            onChange={nameCateOnchange}
            value={dataCategory.name}
          />
          <div
            className={`addprod-input__ten-text ${
              dataCategory.name !== '' ? 'addprod-input__ten-text--active' : ''
            }`}
          >
            Tên
          </div>
        </div>
        <div className="addprod-input__ten">
          <InputCustom
            type="text"
            placeholder="Mô tả"
            onChange={descCateOnchange}
            value={dataCategory.descCategory}
          />
          <div
            className={`addprod-input__ten-text ${
              dataCategory.descCategory !== '' ? 'addprod-input__ten-text--active' : ''
            }`}
          >
            Mô tả
          </div>
        </div>

        <div className="addcategory-item__action wrapp-btn-upload">
          <div>
            <div className="btnuploadimg-wrap__input">
              <input type="file" onChange={handlerChange} />
            </div>
            <div className="btnuploadimg-wrap__img">
              {imgURL.map((url, index) => (
                <Image width={100} height={url === '' ? 0 : 100} src={url} key={index} />
              ))}
            </div>
          </div>
        </div>
        <div className="addcategory-item__action">
          <div className="addcategory-item__Switch">
            <span>Hoạt động</span>
            <Switch defaultChecked onChange={switchHandler} />
          </div>

          <div className="addcategory-item__btn">
            <ButtonCustom
              style={{ backgroundColor: 'var(--color-btn-add)' }}
              onClick={btnSubmitHandler}
            >
              Tạo mới
            </ButtonCustom>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
