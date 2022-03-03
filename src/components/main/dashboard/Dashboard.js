import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { LINKCONECT_BASE, LINKIMG_BASE } from '../../../App';
import { Card, Image } from 'antd';

import moment from 'moment';
const Dashboard = (props) => {
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem('infoAccountLogined'));
  const [chartOrder, setChartOrder] = useState([]);
  const [dataTopSale, setDataTopSale] = useState([]);
  const [dataChartOrder, setDataChartOrder] = useState({
    labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
    datasets: [
      {
        label: 'Số đơn',
        data: [10, 200, 300, 400, 500, 600, 701],
        backgroundColor: ['rgb(54, 162, 235)'],
      },
    ],
  });
  const [optionsOrder, setOptionsOrder] = useState({
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 2,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Đơn Hàng Trong 7 Gần Đây',
      },
    },
  });
  const [dataChartTotal, setDataChartTotal] = useState({
    labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
    datasets: [
      {
        label: 'Số đơn',
        data: [10, 200, 300, 400, 500, 600, 701],
        backgroundColor: ['rgb(54, 162, 235)'],
      },
    ],
  });
  const [optionTotal, setOptionTotal] = useState({
    responsive: true,

    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 3000000,
        },
      },
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Đơn Hàng Trong 7 Gần Đây',
      },
    },
  });

  const [dataChartNewUser, setDataChartNewUser] = useState({
    labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
    datasets: [
      {
        label: 'Số đơn',
        data: [10, 200, 300, 400, 500, 600, 701],
        backgroundColor: ['rgb(54, 162, 235)'],
      },
    ],
  });
  const [optionNewUser, setOptionNewUser] = useState({
    responsive: true,
    fill: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 3000000,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Đơn Hàng Trong 7 Gần Đây',
      },
    },
  });

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
  });

  useEffect(() => {
    if (data === null || data === undefined) {
      navigate('/login');
    } else {
      if (data.role.idRole === 2) {
        navigate('/product');
      } else {
        // navigate('/');
      }
      //#region lấy data chart
      fetch(`${LINKCONECT_BASE}/getDataChartOrders`)
        .then((response) => response.json())
        .then((data) => {
          setChartOrder(data);
          let labels = [];
          let dataChart = [];
          let datasets = [];
          let count = 0;
          for (let i = 0; i < data.length; i++) {
            const element = data[i];
            labels.push(moment(element.date).format('DD/MM'));
            dataChart.push(element.quantity);
            count = count + element.quantity;
          }
          datasets.push({
            label: 'Số đơn',
            data: dataChart,
            backgroundColor: ['rgb(54, 162, 235)'],
          });
          setOptionsOrder((prev) => ({
            ...prev,
            plugins: {
              ...prev.plugins,
              title: {
                ...prev.plugins.title,
                text: `Đơn Hàng Mới: ${count} đơn.`,
              },
            },
          }));
          setDataChartOrder((prev) => ({ ...prev, labels: labels, datasets: datasets }));
        });
      fetch(`${LINKCONECT_BASE}/getDataChartTotal`)
        .then((response) => response.json())
        .then((data) => {
          setChartOrder(data);
          let labels = [];
          let dataChart = [];
          let datasets = [];
          let count = 0;
          for (let i = 0; i < data.length; i++) {
            const element = data[i];
            labels.push(moment(element.date).format('MM/YYYY'));
            dataChart.push(element.total);
            count = count + element.total;
          }
          datasets.push({
            label: 'Số tiền',
            data: dataChart,
            backgroundColor: ['#ffc107'],
          });
          setOptionTotal((prev) => ({
            ...prev,
            plugins: {
              ...prev.plugins,
              title: {
                ...prev.plugins.title,
                text: `Tổng thu nhập trong năm: ${formatter.format(count)}.`,
              },
            },
          }));
          setDataChartTotal((prev) => ({ ...prev, labels: labels, datasets: datasets }));
        });
      fetch(`${LINKCONECT_BASE}/findByDatecreateInYear`)
        .then((response) => response.json())
        .then((data) => {
          setChartOrder(data);
          let labels = [];
          let dataChart = [];
          let datasets = [];
          let count = 0;
          for (let i = 0; i < data.length; i++) {
            const element = data[i];
            labels.push(moment(element.date).format('MM/YYYY'));
            dataChart.push(element.quantity);
            count = count + element.quantity;
          }
          datasets.push({
            label: 'Tổng customer',
            data: dataChart,
            backgroundColor: ['#0dcaf0'],
          });
          setOptionNewUser((prev) => ({
            ...prev,
            plugins: {
              ...prev.plugins,
              title: {
                ...prev.plugins.title,
                text: `Tổng customer mới trong năm: ${count}.`,
              },
            },
          }));
          setDataChartNewUser((prev) => ({
            ...prev,
            labels: labels,
            datasets: datasets,
          }));
        });
      fetch(`${LINKCONECT_BASE}/getTop3Sale`)
        .then((response) => response.json())
        .then((data) => setDataTopSale(data));
      //#endregion
    }
  }, []);
  return (
    <div className="container-dashboard">
      <div className="dashboard-top">
        <div className="dashboard-top__element">
          <Line
            options={optionNewUser}
            data={dataChartNewUser}
            style={{ backgroundColor: 'white' }}
          />
        </div>
        <div className="dashboard-top__element">
          <Bar
            options={optionsOrder}
            data={dataChartOrder}
            style={{ backgroundColor: 'white' }}
          />
        </div>
        <div className="dashboard-top__element">
          <Line
            options={optionTotal}
            data={dataChartTotal}
            style={{ backgroundColor: 'white' }}
          />
        </div>
      </div>
      <div className="dashboard-main">
        <div className="dashboard-main__element">
          <div className="dashboard-main__element-container">
            <div className="dashboard-main__element-container-top">
              Top các sản phẩm bán chạy
            </div>
            {dataTopSale.length !== 0 && (
              <div>
                {dataTopSale.map((item, index) => (
                  <div key={index} className="dashboard-main__element-container-main">
                    <div className="dashboard-main__element-container-main-left">
                      <Image
                        width={120}
                        height={120}
                        src={`${LINKIMG_BASE}${item.imgURL}.jpg?alt=media`}
                      />
                      <div className="dashboard-main__element-container-main-name">
                        {item.nameProduct}
                      </div>
                    </div>
                    <div>
                      {item.priceDiscount !== 0 ? (
                        <div>
                          <div className="dashboard-main__element-container-main-price-original">
                            {formatter.format(item.price)}
                          </div>
                          <div className="dashboard-main__element-container-main-price">
                            {formatter.format(item.priceDiscount)}
                          </div>
                        </div>
                      ) : (
                        <div className="dashboard-main__element-container-main-price">
                          {formatter.format(item.price)}
                        </div>
                      )}
                      <div className="dashboard-main__element-container-main-sold">
                        Đã bán {item.quantity} sản phẩm
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
