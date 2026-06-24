import api from "./axiosConfig";

export const getMovies = () => api.get("/QuanLyPhim/LayDanhSachPhim?maNhom=GP01");
export const getMovieDetail = (id) => api.get(`/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${id}`);
