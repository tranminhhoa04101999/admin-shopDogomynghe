import React, { useState } from 'react';
import { storage } from '../../firebase';
import { ref, deleteObject } from 'firebase/storage';

import { Image } from 'antd';

const ButtonUploadImg = () => {
  const [img, setImg] = useState(null);
  const [imgURL, setImgURL] = useState('');
  const handlerChange = (event) => {
    if (event.target.files[0]) {
      setImg(event.target.files[0]);
      setImgURL(URL.createObjectURL(event.target.files[0]));
    }
  };
  const handlerUpload = () => {
    const uploadTask = storage.ref(`images/${img.name}`).put(img);
    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (error) => console.log(error),
      () => {
        storage
          .ref('images')
          .child(img.name)
          .getDownloadURL()
          .then((url) => {
            // console.log(url);
          });
      }
    );
  };

  const handlerRemove = () => {
    const desertRef = ref(storage, 'images/1.jpg');
    deleteObject(desertRef)
      .then(() => {
        console.log('xoa anh thanh cong');
      })
      .catch((error) => {
        console.log('xoa anh that bai');
        // Uh-oh, an error occurred!
      });
  };
  return (
    <div>
      <input type="file" onChange={handlerChange} />
      <button onClick={handlerUpload}>upload</button>
      <button onClick={handlerRemove}>xoa</button>
      <Image width={100} src={imgURL} />
    </div>
  );
};

export default ButtonUploadImg;
