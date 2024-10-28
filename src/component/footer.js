import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white py-8">
      <div className="container mx-auto text-center">
        {/* Navigation Links */}
        <div className="mb-4">
          <ul className="flex justify-center space-x-6 text-gray-500">
            <li>
              <a href="#" className="hover:text-gray-700 text-red-800">About</a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-700 text-red-800">Our Room</a>
            </li>
          </ul>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-6">
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <i className="fab fa-xing"></i> {/* Example for "X" or Xing icon */}
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <i className="fab fa-github"></i>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700">
            <i className="fab fa-youtube"></i>
          </a>
        </div>

        {/* Copyright Info */}
        <div className="text-gray-400">
          © 2024 Wikusama Hotel, Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
