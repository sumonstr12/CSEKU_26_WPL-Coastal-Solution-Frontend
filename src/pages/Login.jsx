import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");

    // Temporary frontend authentication
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", "citizen");

    navigate("/dashboard");
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-header">
          <p className="eyebrow">COASTAL DISASTER MANAGEMENT</p>
          <h1>Welcome Back</h1>
          <p>
            Sign in to access your disaster management dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <button type="submit" className="primary-btn auth-btn">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </p>

          <button
            type="button"
            className="forgot-btn"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>
      </section>
    </main>
  );
}

export default Login;