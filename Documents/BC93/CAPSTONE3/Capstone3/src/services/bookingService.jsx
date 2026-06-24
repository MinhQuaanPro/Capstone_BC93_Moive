import api from "./axiosConfig";

export const getRoom = (showtimeId) => api.get(`/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${showtimeId}`);
export const bookTicket = (data, token) =>
  api.post("/QuanLyDatVe/DatVe", data, { headers: { Authorization: `Bearer ${token}` } });
