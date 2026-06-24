import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "./movieSlice";
import { Link } from "react-router-dom";

const MovieList = () => {
  const dispatch = useDispatch();
  const { list, status } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  if (status === "loading")
    return <p className="text-center pt-5">Đang tải phim...</p>;
  if (status === "failed")
    return <p className="text-center text-red-500 pt-5">Lỗi khi tải phim!</p>;

  return (
    <div className="container mt-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        🎬 Danh sách phim
      </h1>
      <div className="row">
        {list.map((movie) => (
          <div className="col-4" key={movie.maPhim}>
            <div className="card h-100 shadow-sm">
              <img
                className="card-img-top"
                src={movie.hinhAnh}
                alt={movie.tenPhim}
                style={{ height: "300px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h4 className="card-title text-center">{movie.tenPhim}</h4>
                <Link
                  to={`/movie/${movie.maPhim}`}
                  className="btn btn-primary mt-auto"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
