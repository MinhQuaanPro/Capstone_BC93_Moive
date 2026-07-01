import api from "./axiosConfig";

export const getMovies = () =>
  api.get("/QuanLyPhim/LayDanhSachPhim?maNhom=GP01");

export const getMovieDetail = (id) =>
  api.get(`/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${id}`);

export const getBanners = () =>
  api.get("/QuanLyPhim/LayDanhSachBanner");

export const getHeThongRap = () =>
  api.get("/QuanLyRap/LayThongTinHeThongRap");

export const getLichChieuHeThongRap = (maHeThongRap) =>
  api.get(`/QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=${maHeThongRap}`);