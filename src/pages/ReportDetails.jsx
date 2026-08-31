import { useNavigate } from "react-router-dom";

function ReportDetails() {
  const navigate = useNavigate();

  const report = {
    id: "RPT-2026-0048",
    category: "Flooding",
    location: "Cox's Bazar, Bangladesh",
    date: "30 Aug 2026, 08:30 PM",
    severity: "High",
    status: "Under Review",
    description:
      "Severe flooding has been reported in the coastal area. Water levels have increased significantly and several nearby roads are affected.",
  };

  return (
    <main className="details-page">
      <button
        className="back-btn"
        onClick={() => navigate("/reports")}
      >
        ← Back to My Reports
      </button>

      <section className="details-header">
        <div>
          <p className="eyebrow">REPORT DETAILS</p>
          <h1>{report.category}</h1>
          <p>{report.location}</p>
        </div>

        <span className="detail-status">
          {report.status}
        </span>
      </section>

      <section className="details-grid">
        <div className="details-card">
          <h2>Report Information</h2>

          <div className="info-row">
            <span>Report ID</span>
            <strong>{report.id}</strong>
          </div>

          <div className="info-row">
            <span>Category</span>
            <strong>{report.category}</strong>
          </div>

          <div className="info-row">
            <span>Location</span>
            <strong>{report.location}</strong>
          </div>

          <div className="info-row">
            <span>Date & Time</span>
            <strong>{report.date}</strong>
          </div>

          <div className="info-row">
            <span>Severity</span>
            <strong>{report.severity}</strong>
          </div>
        </div>

        <div className="details-card">
          <h2>Description</h2>

          <p className="description">
            {report.description}
          </p>
        </div>
      </section>

      <section className="details-card timeline-card">
        <h2>Report Status Timeline</h2>

        <div className="timeline">
          <div className="timeline-item completed">
            <div className="timeline-dot">✓</div>
            <div>
              <h3>Submitted</h3>
              <p>Report successfully submitted by citizen.</p>
            </div>
          </div>

          <div className="timeline-item active">
            <div className="timeline-dot">2</div>
            <div>
              <h3>Under Review</h3>
              <p>
                Authorities are currently reviewing the report.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot">3</div>
            <div>
              <h3>Verified</h3>
              <p>Waiting for verification.</p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot">4</div>
            <div>
              <h3>Assigned</h3>
              <p>Responder assignment pending.</p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot">5</div>
            <div>
              <h3>Resolved</h3>
              <p>Incident resolution pending.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ReportDetails;