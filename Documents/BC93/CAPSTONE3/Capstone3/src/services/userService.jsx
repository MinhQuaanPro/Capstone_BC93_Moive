import api from "./axiosConfig";

// Đăng ký tài khoản
export const register = (data) => api.post("/QuanLyNguoiDung/DangKy", data);

// Đăng nhập
export const login = (data) => api.post("/QuanLyNguoiDung/DangNhap", data);

// Lấy thông tin tài khoản (profile)
export const getProfile = () => api.post("/QuanLyNguoiDung/ThongTinTaiKhoan");
