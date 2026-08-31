import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ReportDisaster() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category: "",
    description: "",
    severity: "",
    dateTime: "",
    location: "",
  });

  const [evidence, setEvidence] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.category ||
      !form.description ||
      !form.severity ||
      !form.dateTime ||
      !form.location
    ) {
      setError("Please complete all required fields.");
      return;
    }

    setError("");

    navigate("/confirmation", {
      state: {
        category: form.category,
        severity: form.severity,
        location: form.location,
      },
    });
  };

  return (
    <main className="report-page">
      <section className="report-header">
        <div>
          <p className="eyebrow">CITIZEN REPORTING</p>
          <h1>Report a Disaster</h1>
          <p>
            Submit accurate information about a coastal disaster
            to help authorities respond quickly.
          </p>
        </div>
      </section>

      <form className="report-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Incident Information</h2>
          <p>Provide details about the disaster you observed.</p>

          <div className="form-grid">
            <div className="form-group">
              <label>
                Disaster Category <span>*</span>
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                <option value="Flooding">Flooding</option>
                <option value="Cyclone">Cyclone</option>
                <option value="Coastal Erosion">Coastal Erosion</option>
                <option value="Storm Surge">Storm Surge</option>
                <option value="Infrastructure Damage">
                  Infrastructure Damage
                </option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                Severity <span>*</span>
              </label>

              <select
                name="severity"
                value={form.severity}
                onChange={handleChange}
              >
                <option value="">Select severity</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>
                Description <span>*</span>
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe what happened, affected areas, people at risk, or any other important information..."
                rows="6"
              />
            </div>

            <div className="form-group">
              <label>
                Date & Time <span>*</span>
              </label>

              <input
                type="datetime-local"
                name="dateTime"
                value={form.dateTime}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>
                Location <span>*</span>
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter location"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Location & Evidence</h2>
          <p>Add supporting information if available.</p>

          <div className="location-box">
            <div>
              <strong>📍 Location</strong>
              <p>
                You can enter the location manually or use your
                current GPS location.
              </p>
            </div>

            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setForm({
                        ...form,
                        location: `${position.coords.latitude.toFixed(
                          5
                        )}, ${position.coords.longitude.toFixed(5)}`,
                      });
                    },
                    () => {
                      setError(
                        "Unable to access your current location."
                      );
                    }
                  );
                } else {
                  setError(
                    "Geolocation is not supported by this browser."
                  );
                }
              }}
            >
              Use Current Location
            </button>
          </div>

          <div className="form-group">
            <label>Photo / Video Evidence</label>

            <div className="upload-box">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setEvidence(e.target.files[0])}
              />

              {evidence && (
                <p className="file-name">
                  Selected: {evidence.name}
                </p>
              )}

              <small>
                Optional. Supported image and video files.
              </small>
            </div>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>

          <button type="submit" className="primary-btn">
            Submit Disaster Report
          </button>
        </div>
      </form>
    </main>
  );
}

export default ReportDisaster;