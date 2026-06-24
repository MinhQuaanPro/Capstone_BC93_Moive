import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../user/userSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    taiKhoan: "",
    matKhau: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(userLogin(formData))
      .unwrap()
      .then(() => navigate("/")) // chuyển về trang chủ sau khi login thành công
      .catch(() => {}); // lỗi đã được xử lý trong slice
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Đăng nhập</h2>
      <form
        onSubmit={handleSubmit}
        className="mx-auto"
        style={{ maxWidth: 400 }}
      >
        <div className="mb-3">
          <label className="form-label">Tài khoản</label>
          <input
            type="text"
            name="taiKhoan"
            className="form-control"
            value={formData.taiKhoan}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mật khẩu</label>
          <input
            type="password"
            name="matKhau"
            className="form-control"
            value={formData.matKhau}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      {user && (
        <div className="alert alert-success mt-3">
          Xin chào, {user.taiKhoan}! Bạn đã đăng nhập thành công.
        </div>
      )}
    </div>
  );
};

export default LoginPage;
