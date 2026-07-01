import api from "./axiosConfig";

export const register = (data) => api.post("/QuanLyNguoiDung/DangKy", data);

export const login = (data) => api.post("/QuanLyNguoiDung/DangNhap", data);

export const getProfile = () =>
  api.post("/QuanLyNguoiDung/ThongTinTaiKhoan", null, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

export const updateProfile = (data) =>
  api.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
