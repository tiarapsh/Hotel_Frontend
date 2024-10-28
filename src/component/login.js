import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import hotelll from "./asset/Login-bro.svg"; // Import the 3D icon
import axios from "axios";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ukkhotel.smktelkom-mlg.sch.id/api/login', {
        email,
        password
      }, {
        headers: {
          "makerID": "12",
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        withCredentials: false
      });

      const { user, access_token } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      switch (user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'receptionist':
          navigate('/resepsionis');
          break;
        default:
          setError('Role tidak valid');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your email and password.';
      setError(errorMessage);
    }
  };

  return (
    <div className="container my-5 d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <div className="card shadow-lg" style={{ borderRadius: "15px", overflow: "hidden", maxWidth: "900px" }}>
        <div className="row g-0">
          <div className="col-md-6 d-flex justify-content-center align-items-center p-4" style={{ backgroundColor: "#f7f7f7" }}>
            <img
              src={hotelll}
              alt="Hotel Icon"
              className="img-fluid"
              style={{ width: "80%", maxWidth: "300px", borderRadius: "10px" }}
            />
          </div>

          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center py-5 px-4">
            <div className="text-center mb-4">
              <h1 className="fw-bold" style={{ color: "#B22222" }}>Wikusama Hotel</h1>
              <h5 className="fw-light" style={{ letterSpacing: "1px", color: "#555" }}>Sign into your account</h5>
            </div>

            {error && (
              <div className="alert alert-danger text-center w-100" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ width: "100%", maxWidth: "350px" }}>
              <div className="mb-4">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    borderColor: "#B22222",
                    borderRadius: "8px",
                    padding: "10px"
                  }}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    borderColor: "#B22222",
                    borderRadius: "8px",
                    padding: "10px"
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-lg btn-block w-100"
                style={{
                  backgroundColor: "#B22222",
                  color: "white",
                  borderRadius: "8px",
                  padding: "12px",
                  fontWeight: "bold"
                }}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;