import api from "./axiosConfig";

export const register = (data) => api.post("/QuanLyNguoiDung/DangKy", data);

export const login = (data) => api.post("/QuanLyNguoiDung/DangNhap", data);

export const getProfile = () => api.post("/QuanLyNguoiDung/ThongTinTaiKhoan");
