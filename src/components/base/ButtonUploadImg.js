import React, { useState } from 'react';
import { storage } from '../../firebase';
import './ButtonUploadImg.css';

import { Image } from 'antd';

const ButtonUploadImg = (props) => {
  const [img, setImg] = useState(null);
  const [imgURL, setImgURL] = useState(['']);
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
        // upload ten anh len database
        let urlAdddb = img[i].name.substring(0, img[i].name.indexOf('.jpg'));
        fetch(
          `http://localhost:8080/saveimageproduct?imgURL=${urlAdddb}&idProduct=${props.idMaxProduct}`,
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
    } else {
      fetch(
        `http://localhost:8080/saveimageproduct?imgURL=${'defaultImage'}&idProduct=${
          props.idMaxProduct
        }`,
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
  };

  // xoa trne firebase
  // const handlerRemove = () => {
  //   const desertRef = ref(storage, 'images/1.jpg');
  //   deleteObject(desertRef)
  //     .then(() => {
  //       console.log('xoa anh thanh cong');
  //     })
  //     .catch((error) => {
  //       console.log('xoa anh that bai');
  //       // Uh-oh, an error occurred!
  //     });
  // };
  // nếu ấn thêm sản phẩm chạy upload
  if (props.activeUpload === 1) {
    handlerUpload();
  }

  return (
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
  );
};

export default ButtonUploadImg;
