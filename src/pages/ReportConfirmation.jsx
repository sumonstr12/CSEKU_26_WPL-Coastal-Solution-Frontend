import { useLocation, useNavigate } from "react-router-dom";

function ReportConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const report = location.state || {
    category: "Disaster Report",
    severity: "Pending",
    location: "Location submitted",
  };

  return (
    <main className="confirmation-page">
      <section className="confirmation-card">

        <div className="success-icon">
          ✓
        </div>

        <p className="eyebrow">REPORT SUBMITTED</p>

        <h1>Report Submitted Successfully</h1>

        <p className="confirmation-message">
          Thank you for helping keep our coastal communities safe.
          Your report has been received and will be reviewed by
          the responsible authority.
        </p>

        <div className="report-summary">
          <div className="summary-row">
            <span>Report ID</span>
            <strong>RPT-2026-0048</strong>
          </div>

          <div className="summary-row">
            <span>Disaster Type</span>
            <strong>{report.category}</strong>
          </div>

          <div className="summary-row">
            <span>Severity</span>
            <strong>{report.severity}</strong>
          </div>

          <div className="summary-row">
            <span>Location</span>
            <strong>{report.location}</strong>
          </div>

          <div className="summary-row">
            <span>Status</span>
            <strong className="status-pending">
              Submitted
            </strong>
          </div>
        </div>

        <div className="next-info">
          <h3>What happens next?</h3>

          <p>
            Your report will be reviewed and verified by the
            disaster management authority. You can track its
            progress from <strong>My Reports</strong>.
          </p>
        </div>

        <div className="confirmation-actions">
          <button
            className="primary-btn"
            onClick={() => navigate("/reports")}
          >
            View My Reports
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </button>
        </div>

      </section>
    </main>
  );
}

export default ReportConfirmation;