import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/user/userSlice"; // đường dẫn tuỳ dự án
import { Link } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-dark px-3">
      <Link className="navbar-brand text-white" to="/">
        Rạp Phim Online
      </Link>

      <div className="ms-auto d-flex align-items-center">
        {user ? (
          <>
            {/* Avatar: nếu API có hình thì dùng user.hinhAnh, nếu không thì hiển thị chữ cái đầu */}
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
              style={{ width: 40, height: 40 }}
            >
              {user.hoTen ? user.hoTen.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="me-3">{user.taiKhoan}</span>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline-primary me-2" to="/login">
              Login
            </Link>
            <Link className="btn btn-outline-success" to="/register">
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
