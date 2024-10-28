import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Hotel from "../asset/jacques-bopp-jW7zki2f3qc-unsplash.jpg";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import BackgroundImage from "../asset/rod-long-2P_ifaetDm0-unsplash.jpg";
import Footer from "../footer";

const HomePage = () => {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Navbar /> {/* Include Navbar here */}

      {/* Hero Section with overlay */}
      <div
        className="relative h-[550px] flex flex-col justify-center items-center text-center text-white py-5"
        style={{ margin: 0, padding: 0 }}
      >
        {/* Background with dark overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${BackgroundImage})`,
            filter: "brightness(50%)", // Darken background
            margin: 0,
            padding: 0,
          }}
        />
        <h1 className="relative z-10 text-5xl font-bold animate-fade">
          Welcome to Wikusama Hotel
        </h1>
        <p className="relative z-10 text-xl mb-3">
          Your perfect holiday experience awaits!
        </p>
        <button
          className="relative z-10 btn text-white border-none rounded-full px-5 py-2"
          style={{
            backgroundColor: "#B22222",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Link
            to="/kamar"
            className="text-white no-underline font-semibold"
          >
            Book Now
          </Link>
        </button>
      </div>

      {/* About Section with card layout */}
      <div className="container my-5">
        <div className="card shadow-lg p-4 border-0">
          <div className="row g-0">
            <div className="col-md-6">
              <img src={Hotel} alt="Hotel" className="img-fluid rounded" />
            </div>
            <div className="col-md-6 d-flex align-items-center">
              <div className="p-3">
                <h2>About Our Hotel</h2>
                <p>
                  Wikusama Hotel offers a comfortable and luxurious stay. We are
                  strategically located in the city center with the best facilities
                  at affordable prices for you!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">What Our Guests Say</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card shadow-sm border-0 p-3">
              <p>
                "Amazing experience! The staff was friendly, and the rooms were
                immaculate. Will definitely be back!"
              </p>
              <small>- Alex, Solo Traveler</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0 p-3">
              <p>
                "Perfect for family vacations. Great location, wonderful
                amenities, and very comfortable rooms."
              </p>
              <small>- Sarah, Family</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0 p-3">
              <p>
                "The best hotel experience I've ever had! The city center
                location is unbeatable."
              </p>
              <small>- Michael, Business Traveler</small>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
