import React, { useEffect } from "react";
import { useState } from "react";
import { notification } from "antd";
import "./Login.css";
import { LINKCONECT_BASE } from "../../../App";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
var dem = 0;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dataAccount, setDataAccount] = useState([]);
  const navigate = useNavigate();

  const openNotification = () => {
    notification.open({
      message: "Đăng nhập lỗi",
      description: "vui lòng kiểm tra lại email hoặc password.",
      icon: <ClockCircleOutlined style={{ color: "#ff4d4f" }} />,
      style: { backgroundColor: "#fff2f0" },
    });
  };

  const inputEmailOnchange = (event) => {
    setEmail(event.target.value);
  };
  const inputPasswordOnchange = (event) => {
    setPassword(event.target.value);
  };
  useEffect(() => {
    if (dataAccount.length === 0) {
      if (dem > 0) {
        openNotification();
      }
      dem++;
    } else {
      localStorage.setItem("infoAccountLogined", JSON.stringify(dataAccount[0]));
      navigate("/dashboard");
      //let da = JSON.parse(localStorage.getItem("infoAccountLogined"));
    }
  }, [dataAccount, setDataAccount]);

  const submitHandler = (event) => {
    const linklogin =
      LINKCONECT_BASE + "/loginadmin?email=" + email + "&password=" + password + "";
    console.log(linklogin);
    fetch(linklogin)
      .then((res) => res.json())
      .then((data) => {
        setDataAccount(data);
      });
    // const responsive = await fetch(linklogin);
    // const data = await responsive.json();
    console.log(dataAccount);
  };

  return (
    <div className="wrap-login">
      <div className="login-main">
        <p className="login-main__title">Đăng Nhập</p>
        <div className="wrap-login-main__input">
          <input
            type="email"
            className="login-main__input"
            placeholder="Nhập email"
            onChange={inputEmailOnchange}
          />
        </div>
        <div className="wrap-login-main__input">
          <input
            type="password"
            className="login-main__input"
            placeholder="Mật khẩu"
            onChange={inputPasswordOnchange}
          />
        </div>
      </div>
      <button className="login-main__submit-btn" onClick={submitHandler}>
        Đăng Nhập
      </button>
    </div>
  );
};

export default Login;
