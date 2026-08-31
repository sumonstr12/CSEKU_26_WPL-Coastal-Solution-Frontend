function CitizenDashboard() {
  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">CITIZEN PORTAL</p>
          <h1>Welcome back, Citizen</h1>
          <p>
            Stay informed, report incidents, and help keep your coastal
            community safe.
          </p>
        </div>

        <button className="primary-btn">
          + Report a Disaster
        </button>
      </section>

      <section className="dashboard-cards">
        <div className="info-card">
          <span>Active Alerts</span>
          <strong>3</strong>
          <small>Official warnings</small>
        </div>

        <div className="info-card">
          <span>My Reports</span>
          <strong>4</strong>
          <small>Submitted reports</small>
        </div>

        <div className="info-card">
          <span>In Progress</span>
          <strong>2</strong>
          <small>Reports being handled</small>
        </div>

        <div className="info-card">
          <span>Resolved</span>
          <strong>5</strong>
          <small>Successfully resolved</small>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Recent Reports</h2>
              <p>Track your latest disaster reports.</p>
            </div>

            <a href="/reports">View all</a>
          </div>

          <div className="report-row">
            <div>
              <strong>Flooding</strong>
              <span>Cox's Bazar, Bangladesh</span>
            </div>

            <span className="status pending">Under Review</span>
          </div>

          <div className="report-row">
            <div>
              <strong>Cyclone</strong>
              <span>Teknaf, Bangladesh</span>
            </div>

            <span className="status progress">In Progress</span>
          </div>

          <div className="report-row">
            <div>
              <strong>Coastal Erosion</strong>
              <span>Kutubdia, Bangladesh</span>
            </div>

            <span className="status resolved">Resolved</span>
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-heading">
            <div>
              <h2>Emergency Assistance</h2>
              <p>Need immediate help?</p>
            </div>
          </div>

          <div className="emergency-box">
            <strong>Emergency SOS</strong>
            <p>
              Contact emergency services or request assistance from
              nearby responders.
            </p>

            <button className="sos-btn">
              SOS / Get Help
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CitizenDashboard;