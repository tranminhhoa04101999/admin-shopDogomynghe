import React from 'react';
import './EditCategory.css';
import InputCustom from '../../base/InputCustom';
import { useState, useEffect } from 'react';
import { Switch } from 'antd';
import ButtonCustom from '../../base/ButtonCustom';
import { LINKCONECT_BASE, LINKIMG_BASE } from '../../../App';
import { notification, Image } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { storage } from '../../../firebase';
import { ref, deleteObject } from 'firebase/storage';

const EditCategory = () => {
  const [imgURL, setImgURL] = useState(['']);
  const [img, setImg] = useState(null);
  const navigate = useNavigate();
  const [imgRemove, setimgRemove] = useState('');

  const { state } = useLocation();

  const [dataCategory, setDataCategory] = useState({
    idCategory: 0,
    name: '',
    descCategory: '',
    imgURL: 'defaultImage',
    isActive: 1,
  });
  useEffect(() => {
    if (state === null) {
      navigate('/category/showcategory');
    } else {
      let dataRes = state.data;
      dataRes.descCategory = dataRes.descCategory === null ? '' : dataRes.descCategory;
      setDataCategory(state.data);
    }
  }, []);
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
      setimgRemove(dataCategory.imgURL);
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
  const handlerRemove = () => {
    if (imgRemove !== '') {
      //xoa tren firebase

      const desertRef = ref(storage, `images/${imgRemove}.jpg`);
      deleteObject(desertRef)
        .then(() => {
          console.log('xoa anh thanh cong');
        })
        .catch((error) => {
          console.log('xoa anh that bai');
          // Uh-oh, an error occurred!
        });
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
    let imgURLupdate = dataCategory.imgURL;
    if (img !== null) {
      imgURLupdate = img[0].name.substring(0, img[0].name.indexOf('.jpg')); // cắt đuôi jpg
      //nếu có thay đổi ảnh thì xóa cái thêm mới vào firebase rồi xóa hình cũ trnê đố đii
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
        //xoa anh cu
        handlerRemove();
      }
    }

    // upload category vao database

    var dataAdd = dataCategory;
    dataAdd.imgURL = imgURLupdate;

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
          message: 'Sửa thành công',
          desc: dataAdd.name,
        });
        navigate('/category/showcategory');
      })
      .catch((error) =>
        openNotificationWithIcon({
          type: 'error',
          message: 'sửa thất bại',
          desc: error,
        })
      );
  };
  return (
    <div className="wrap-editcategory">
      <div className="wrap-editcategory__item">
        <InputCustom
          type="text"
          placeholder="ID"
          value={dataCategory.idCategory}
          disable={true}
          onChange={() => {}}
        />
        <InputCustom
          type="text"
          placeholder="Tên loại"
          onChange={nameCateOnchange}
          value={dataCategory.name}
        />
        <InputCustom
          type="text"
          placeholder="Mô tả"
          onChange={descCateOnchange}
          value={dataCategory.descCategory}
        />
        <div className="wrap-imageDefault-edit">
          <Image
            width={100}
            height={100}
            src={`${LINKIMG_BASE}${dataCategory.imgURL}.jpg?alt=media`}
          />
        </div>

        <div className="editcategory-item__action wrapp-btn-upload">
          <div>
            <div
              className="btnuploadimg-wrap__input"
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <span style={{ fontSize: '1.4rem', marginRight: '6px' }}>
                Chọn để thay đổi ảnh:{' '}
              </span>
              <input type="file" onChange={handlerChange} />
            </div>
            <div className="btnuploadimg-wrap__img">
              {imgURL.map((url, index) => (
                <Image width={100} height={url === '' ? 0 : 100} src={url} key={index} />
              ))}
            </div>
          </div>
        </div>
        <div className="editcategory-item__action">
          <div className="editcategory-item__Switch">
            <span>Hoạt động</span>
            <Switch
              checked={dataCategory.isActive === 1 ? true : false}
              onChange={switchHandler}
            />
          </div>

          <div className="editcategory-item__btn">
            <ButtonCustom
              style={{ backgroundColor: 'var(--color-btn-add)' }}
              onClick={btnSubmitHandler}
            >
              Thay đổi
            </ButtonCustom>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
