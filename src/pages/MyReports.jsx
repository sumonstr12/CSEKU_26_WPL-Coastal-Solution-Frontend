import { useState } from "react";
import { useNavigate } from "react-router-dom";

const reports = [
  {
    id: "RPT-2026-0048",
    category: "Flooding",
    location: "Cox's Bazar, Bangladesh",
    date: "30 Aug 2026, 08:30 PM",
    severity: "High",
    status: "Under Review",
  },
  {
    id: "RPT-2026-0042",
    category: "Cyclone",
    location: "Teknaf, Bangladesh",
    date: "28 Aug 2026, 05:15 PM",
    severity: "Critical",
    status: "In Progress",
  },
  {
    id: "RPT-2026-0037",
    category: "Coastal Erosion",
    location: "Kutubdia, Bangladesh",
    date: "25 Aug 2026, 02:40 PM",
    severity: "Medium",
    status: "Resolved",
  },
  {
    id: "RPT-2026-0031",
    category: "Infrastructure Damage",
    location: "Moheshkhali, Bangladesh",
    date: "22 Aug 2026, 09:20 AM",
    severity: "Low",
    status: "Rejected",
  },
];

function MyReports() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");

  const filteredReports =
    filter === "All"
      ? reports
      : reports.filter((report) => report.status === filter);

  return (
    <main className="reports-page">
      <section className="reports-header">
        <div>
          <p className="eyebrow">CITIZEN PORTAL</p>
          <h1>My Reports</h1>
          <p>
            Track the status and progress of your submitted
            disaster reports.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/report")}
        >
          + Report a Disaster
        </button>
      </section>

      <section className="report-stats">
        <div className="report-stat">
          <span>Total Reports</span>
          <strong>{reports.length}</strong>
        </div>

        <div className="report-stat">
          <span>Under Review</span>
          <strong>
            {reports.filter(
              (r) => r.status === "Under Review"
            ).length}
          </strong>
        </div>

        <div className="report-stat">
          <span>In Progress</span>
          <strong>
            {reports.filter(
              (r) => r.status === "In Progress"
            ).length}
          </strong>
        </div>

        <div className="report-stat">
          <span>Resolved</span>
          <strong>
            {reports.filter(
              (r) => r.status === "Resolved"
            ).length}
          </strong>
        </div>
      </section>

      <section className="reports-card">
        <div className="reports-toolbar">
          <div>
            <h2>Submitted Reports</h2>
            <p>View and track your incident reports.</p>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Reports</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="reports-list">
          {filteredReports.map((report) => (
            <article className="report-item" key={report.id}>
              <div className="report-main">
                <div className="report-title-row">
                  <h3>{report.category}</h3>

                  <span
                    className={`report-status ${report.status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {report.status}
                  </span>
                </div>

                <p className="report-location">
                  📍 {report.location}
                </p>

                <div className="report-meta">
                  <span>{report.id}</span>
                  <span>{report.date}</span>
                  <span>Severity: {report.severity}</span>
                </div>
              </div>

              <button
  className="view-btn"
  onClick={() => navigate("/report-details")}
>
  View Details →
</button>
            </article>
          ))}

          {filteredReports.length === 0 && (
            <div className="empty-reports">
              <h3>No reports found</h3>
              <p>
                There are no reports matching the selected
                status.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default MyReports;