import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import { LINKCONECT_BASE, LINKIMG_BASE } from '../../../App';
import { Card, Image, Select, Input, Button, notification } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

const gridStyle = {
  width: '100%',
  textAlign: 'center',
  padding: '10px 20px',
};

const Dashboard = (props) => {
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem('infoAccountLogined'));
  const [chartOrder, setChartOrder] = useState([]);
  const [thongkeProduct, setThongkeProduct] = useState(null);
  const [dataIncomeTotal, setDataIncomeTotal] = useState([]);
  const [dataAllStatusOrder, setDataAllStatusOrder] = useState({});
  const [thongkeChoose, setThongkeChoose] = useState({
    choose: 1,
    begin: '',
    end: '',
  });
  const openNotificationWithIcon = (props) => {
    notification[props.type]({
      message: props.message,
      description: props.desc,
    });
  };
  const { Option } = Select;
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
        navigate('/products');
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
  const ThongkeOnchange = (value) => {
    setThongkeChoose((prev) => ({ ...prev, choose: value }));
  };
  const inputDateBeginOnchange = (e) => {
    setThongkeChoose((prev) => ({ ...prev, begin: e.target.value }));
  };
  const inputDateEndOnchange = (e) => {
    setThongkeChoose((prev) => ({ ...prev, end: e.target.value }));
  };
  const btnThongkeOnClick = () => {
    setThongkeProduct(null);

    if (thongkeChoose.begin === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Vui lòng chọn ngày bắt đầu thống kê',
      });
      return;
    } else if (thongkeChoose.end === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Vui lòng chọn ngày kết thúc thống kê',
      });
      return;
    }
    let dateBegin = new Date(thongkeChoose.begin);
    let dateEnd = new Date(thongkeChoose.end);
    if (dateBegin > dateEnd) {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Không được chọn ngày bắt lớn hơn ngày kết thúc',
      });
      return;
    }
    let begin = thongkeChoose.begin.replaceAll('-', '/');
    let end = thongkeChoose.end.replaceAll('-', '/');
    if (thongkeChoose.choose === 1) {
      fetch(
        `${LINKCONECT_BASE}/incomeFindBydateBeginAnddateEnd?begin=${begin}&end=${end}`
      )
        .then((response) => response.json())
        .then((data) => {
          setDataIncomeTotal(data);
        });
      fetch(`${LINKCONECT_BASE}/getAllStatusOrder?begin=${begin}&end=${end}`)
        .then((response) => response.json())
        .then((data) => {
          setDataAllStatusOrder(data);
        });
    }
    if (thongkeChoose.choose === 2) {
    }
    if (thongkeChoose.choose === 3) {
      fetch(`${LINKCONECT_BASE}/getTopSaleWithDate?begin=${begin}&end=${end}`)
        .then((response) => response.json())
        .then((data) => setThongkeProduct(data));
    }
  };

  const btnExportExcelOnClick = () => {
    if (thongkeChoose.begin === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Vui lòng chọn ngày bắt đầu thống kê',
      });
      return;
    } else if (thongkeChoose.end === '') {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Lỗi để trống',
        desc: 'Vui lòng chọn ngày kết thúc thống kê',
      });
      return;
    }
    let dateBegin = new Date(thongkeChoose.begin);
    let dateEnd = new Date(thongkeChoose.end);
    if (dateBegin > dateEnd) {
      openNotificationWithIcon({
        type: 'warning',
        message: 'Không được chọn ngày bắt lớn hơn ngày kết thúc',
      });
      return;
    }
    let begin = thongkeChoose.begin.replaceAll('-', '/');
    let end = thongkeChoose.end.replaceAll('-', '/');
    if (thongkeChoose.choose === 1) {
      fetch(
        `${LINKCONECT_BASE}/statisticalTotalExportFileExcel?begin=${begin}&end=${end}`,
        { responseType: 'blob' }
      )
        .then((response) => {
          response.blob().then((blob) => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'thongke.xlsx';
            a.click();
          });
        })
        .then((data) => {})
        .then((err) => console.log('errr', err));
    }
  };
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
          <div className="dashboard-main__element-thongke-top">
            <Select
              defaultValue={1}
              style={{ width: 180, marginRight: '10px' }}
              onChange={ThongkeOnchange}
            >
              <Option value={1}>Thu nhập</Option>
              {/* <Option value={2}>Đơn hàng</Option> */}
              <Option value={3}>Sản phẩm bán ra</Option>
            </Select>
            <Input
              type={'date'}
              style={{ width: '160px', margin: '0 10px' }}
              onChange={inputDateBeginOnchange}
            />
            <FontAwesomeIcon icon={faLongArrowAltRight} size="2x" />
            <Input
              type={'date'}
              style={{ width: '160px', margin: '0 10px' }}
              onChange={inputDateEndOnchange}
            />
            <Button onClick={() => btnThongkeOnClick()}>Thống kê</Button>
            <Button
              style={{ marginLeft: '10px' }}
              onClick={() => btnExportExcelOnClick()}
            >
              Xuất Excel
            </Button>
          </div>
          <div className="dashboard-main__element-thongke-main">
            {thongkeProduct === null ? (
              <div>
                <Card>
                  <Card.Grid
                    style={{
                      ...gridStyle,
                      display: 'flex',
                      justifyContent: 'space-around',
                    }}
                  >
                    <span className="element-thongke-main__total">
                      Tổng đơn: <div>{dataAllStatusOrder.tongDon}</div>
                    </span>
                    <span className="element-thongke-main__total">
                      Đã giao: <div>{dataAllStatusOrder.daGiao}</div>
                    </span>
                    <span className="element-thongke-main__total">
                      Đã hủy: <div>{dataAllStatusOrder.daHuy}</div>
                    </span>
                  </Card.Grid>
                  <Card.Grid
                    style={{
                      ...gridStyle,
                      display: 'flex',
                      justifyContent: 'space-around',
                    }}
                  >
                    <span className="element-thongke-main__total">
                      Tổng nhập:{' '}
                      <div>
                        {formatter.format(
                          dataIncomeTotal.reduce(
                            (prev, cur) =>
                              (prev += cur.averageImportPrice * cur.quantitySale),
                            0
                          )
                        )}
                      </div>
                    </span>
                    <span className="element-thongke-main__total">
                      Tổng bán:{' '}
                      <div>
                        {formatter.format(
                          dataIncomeTotal.reduce(
                            (prev, cur) => (prev += cur.totalPriceSale),
                            0
                          )
                        )}
                      </div>
                    </span>
                    <span className="element-thongke-main__total">
                      Tổng lợi nhuận:{' '}
                      <div>
                        {formatter.format(
                          dataIncomeTotal.reduce(
                            (prev, cur) => (prev += cur.totalPriceSale),
                            0
                          ) -
                            dataIncomeTotal.reduce(
                              (prev, cur) =>
                                (prev += cur.averageImportPrice * cur.quantitySale),
                              0
                            )
                        )}
                      </div>
                    </span>
                  </Card.Grid>
                </Card>
                <Card>
                  <Card.Grid style={gridStyle}>
                    <div className="element-thongke-main__wapper">
                      <span className="element-thongke-main__id">ID</span>
                      <span className="element-thongke-main__nameprod">Sản phẩm</span>
                      <span className="element-thongke-main__priceaverage">
                        Giá Nhập(Trung Bình)
                      </span>
                      <span className="element-thongke-main__quantity">Số lượng bán</span>
                      <span className="element-thongke-main__totalPriceSale">
                        Tổng bán
                      </span>
                    </div>
                  </Card.Grid>
                  {dataIncomeTotal.length === 0 ? (
                    <div> Chưa chọn thống kê</div>
                  ) : (
                    <div>
                      {dataIncomeTotal.map((item, index) => {
                        return (
                          <Card.Grid key={index} style={gridStyle}>
                            <div className="element-thongke-main__wapper">
                              <span className="element-thongke-main__id">{item.id}</span>
                              <span className="element-thongke-main__nameprod">
                                {item.name}
                              </span>
                              <span className="element-thongke-main__priceaverage">
                                {formatter.format(item.averageImportPrice)}
                              </span>
                              <span className="element-thongke-main__quantity">
                                {item.quantitySale}
                              </span>
                              <span className="element-thongke-main__totalPriceSale">
                                {formatter.format(item.totalPriceSale)}
                              </span>
                            </div>
                          </Card.Grid>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </div>
            ) : (
              <div>
                {thongkeProduct.map((item, index) => (
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
