import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "./userSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    taiKhoan: "",
    matKhau: "",
    email: "",
    soDt: "",
    maNhom: "GP01",
    hoTen: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(userRegister(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/login");
      }
    });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "450px", width: "100%" }}>
        <h2 className="text-center mb-4 text-success">Đăng ký</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tài khoản</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tài khoản"
              value={form.taiKhoan}
              onChange={(e) => setForm({ ...form, taiKhoan: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập mật khẩu"
              value={form.matKhau}
              onChange={(e) => setForm({ ...form, matKhau: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Nhập email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Số điện thoại</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập số điện thoại"
              value={form.soDt}
              onChange={(e) => setForm({ ...form, soDt: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Họ tên</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập họ tên"
              value={form.hoTen}
              onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>
        {error && <p className="text-danger text-center mt-2">{error.content || "Có lỗi xảy ra"}</p>}
        <p className="text-center mt-3">
          Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
