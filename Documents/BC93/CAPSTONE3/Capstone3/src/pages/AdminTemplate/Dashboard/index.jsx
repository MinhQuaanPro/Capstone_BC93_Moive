export default function Dashboard() {
  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Dashboard</h2>
      <div className="row">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Người dùng</h5>
              <p className="card-text display-4">1,234</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Phim</h5>
              <p className="card-text display-4">56</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">Đặt vé</h5>
              <p className="card-text display-4">892</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger mb-3">
            <div className="card-body">
              <h5 className="card-title">Doanh thu</h5>
              <p className="card-text display-4">125M</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}