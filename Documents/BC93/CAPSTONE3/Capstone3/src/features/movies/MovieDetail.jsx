import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchMovieDetail } from "./movieSlice";

const MovieDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { detail, status } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchMovieDetail(id));
  }, [dispatch, id]);

  if (status === "loading")
    return <p className="text-center pt-5">Đang tải chi tiết phim...</p>;
  if (status === "failed")
    return (
      <p className="text-center text-danger pt-5">Lỗi khi tải chi tiết phim!</p>
    );
  if (!detail) return null;

  const trailerEmbed = detail.trailer?.replace("watch?v=", "embed/");

  return (
    <div className="container mt-4 pt-5">
      <div className="row mb-4">
        <div className="col-md-4">
          <img
            src={detail.hinhAnh}
            alt={detail.tenPhim}
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-8">
          <h2 className="text-primary">{detail.tenPhim}</h2>
          <p>
            <strong>Mã phim:</strong> {detail.maPhim}
          </p>
          <p>
            <strong>Ngày khởi chiếu:</strong> {detail.ngayKhoiChieu}
          </p>
          <p>{detail.moTa}</p>
          <div className="mt-3">
            <h5 className="fw-bold mb-2">Đặt Vé</h5>
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                background: "#f9f9f9",
              }}
            >
              {detail.heThongRapChieu?.map((rap) => (
                <div key={rap.maHeThongRap} className="mb-3">
                  <h6 className="text-danger">{rap.tenHeThongRap}</h6>
                  {rap.cumRapChieu?.map((cum) => (
                    <div key={cum.maCumRap} className="mb-2">
                      <p className="fw-bold">{cum.tenCumRap}</p>
                      <div className="d-flex flex-wrap gap-2">
                        {cum.lichChieuPhim?.map((lich) => (
                          <Link
                            key={lich.maLichChieu}
                            to={`/booking/${lich.maLichChieu}`}
                            className="btn btn-outline-primary btn-sm"
                          >
                            {new Date(lich.ngayChieuGioChieu).toLocaleString()}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {detail.trailer && (
        <div className="mb-5">
          <h5 className="fw-bold mb-3">Trailer chính thức</h5>
          <div className="ratio ratio-16x9 w-50">
            <iframe
              src={trailerEmbed}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
