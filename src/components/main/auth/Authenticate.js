import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Authenticate = (props) => {
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem('infoAccountLogined'));

  useEffect(() => {
    if (data === null || data === undefined) {
      navigate('/login');
    } else {
      // navigate('/');
      navigate('/dashboard');
    }
  }, []);

  return <div>hehe</div>;
};

export default Authenticate;
