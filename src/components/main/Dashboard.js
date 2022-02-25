import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = (props) => {
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem('infoAccountLogined'));

  useEffect(() => {
    if (data === null || data === undefined) {
      navigate('/login');
    } else {
      if (data.role.idRole === 2) {
        navigate('/product');
      } else {
        // navigate('/');
      }
    }
  }, []);
  return <div className="grid wide">day la dashboard</div>;
};

export default Dashboard;
