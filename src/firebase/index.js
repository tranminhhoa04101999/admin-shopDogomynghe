import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCgh1CYJX3jRBFw1cBDzi7LirfXtlBll_o',
  authDomain: 'image-kddgmn-52ebf.firebaseapp.com',
  projectId: 'image-kddgmn-52ebf',
  storageBucket: 'image-kddgmn-52ebf.appspot.com',
  messagingSenderId: '1082212908719',
  appId: '1:1082212908719:web:4fe2ee04604f445e66de5a',
  measurementId: 'G-V5SBWMP3FK',
};

firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

export { storage, firebase as default };
