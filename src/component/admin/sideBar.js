import React from 'react';
import 'boxicons/css/boxicons.min.css';
import Logo from '../asset/hotel-building.png';

function Sidebar() {
  return (
    <div className="min-h-screen flex flex-row bg-gray-100">
      <div className="flex flex-col w-56 bg-[#B22222] rounded-r-3xl overflow-hidden">
        {/* Header dengan logo dan nama hotel */}
        <div className="flex items-center justify-center h-20 shadow-md bg-gray-100 ">
          <img
            src={Logo} // Ganti dengan path logo Anda
            alt="Logo Wikusama Hotel"
            className="h-10 w-10 mr-3 mb-2"  // Styling logo
          />
          <h1 className="text-xl font-bold" style={{ color: '#B22222', fontFamily: 'Poppins, sans-serif' }}>
            Wikusama Hotel
          </h1>
        </div>

        {/* Menu Sidebar */}
        <ul className="flex flex-col py-4">
          <li>
            <a
              href="/admin"
              className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-200"
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white">
                <i className="bx bx-hotel"></i>
              </span>
              <span className="text-sm font-medium">Data Kamar</span>
            </a>
          </li>
          <li>
            <a
              href="/tipekamar"
              className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-200"
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white">
                <i className="bx bx-folder"></i>
              </span>
              <span className="text-sm font-medium">Data Tipe Kamar</span>
            </a>
          </li>
          <li>
            <a
              href="/user"
              className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-200"
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white">
                <i className="bx bx-user"></i>
              </span>
              <span className="text-sm font-medium">Data User</span>
            </a>
          </li>
          <li>
            <a
              href="/logout"
              className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-200"
            >
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-white">
                <i className="bx bx-log-out"></i>
              </span>
              <span className="text-sm font-medium">Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
