import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import Navbar from "./navbar";
import Footer from "../footer";
import axios from "axios";

function Pemesanan() {
  const location = useLocation();
  const navigate = useNavigate();
  const { type_id, startDate, endDate, roomType, price, img } =
    location.state || {};

  const [roomCount, setRoomCount] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guest, setGuest] = useState("");
  const [orderNumber, setOrderNumber] = useState(null); // Store order number here

  const handleIncrement = () => setRoomCount((prev) => prev + 1);
  const handleDecrement = () =>
    setRoomCount((prev) => (prev > 1 ? prev - 1 : 1));

  const calculateNights = (start, end) => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(new Date(end) - new Date(start));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const totalNights = calculateNights(startDate, endDate);
  const totalPrice = totalNights * price * roomCount;
  console.log(location.state);

  const handlePopupSubmit = async () => {
    setShowPopup(false);
    try {
      // Mengirim permintaan untuk membuat pesanan
      const response = await axios.post(
        `https://ukkhotel.smktelkom-mlg.sch.id/api/orders`,
        {
          customer_name: name,
          customer_email: email,
          check_in: startDate,
          check_out: endDate,
          guest_name: guest,
          rooms_amount: roomCount,
          type_id: type_id,
        },
        {
          headers: {
            makerID: "12",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: false,
        }
      );

      // Mengambil nomor pesanan dari respons
      const orderNumber = response.data.data.order_number;
      setOrderNumber(orderNumber);

      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
  <html>
    <head>
      <title>Invoice Pemesanan</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #333;
        }
        h1, h2 {
          color: #d32f2f; /* Warna merah */
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 8px;
        }
        .invoice-header, .invoice-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .invoice-header h1 {
          font-size: 24px;
          margin: 0;
        }
        .invoice-header .invoice-number {
          font-size: 20px;
          font-weight: bold;
          color: #d32f2f;
        }
        .invoice-details, .client-details {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        .client-details div, .invoice-details div {
          width: 45%;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .table th, .table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: center;
        }
        .table th {
          background-color: #d32f2f;
          color: #fff;
          font-weight: bold;
        }
        .table td {
          background-color: #f9f9f9;
        }
        .total-section {
          text-align: right;
          margin-top: 20px;
        }
        .total-section p {
          font-size: 18px;
          font-weight: bold;
        }
        .footer-info {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          font-size: 0.9em;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="invoice-header">
          <h1>Invoice Pemesanan</h1>
          <span class="invoice-number">#${orderNumber}</span>
        </div>

        <div class="invoice-details">
          <div>
            <p><strong>Tanggal:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="client-details">
            <p><strong>Nama Pelanggan:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>NAMA</th>
              <th>JUMLAH</th>
              <th>HARGA SATUAN</th>
              <th>SUB TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${roomType || "Akomodasi Hotel"}</td>
              <td>${roomCount} Kamar x ${totalNights} Malam</td>
              <td>${price.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}</td>
              <td>${(price * roomCount * totalNights).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-section">
          <p>SUB TOTAL: ${totalPrice.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })}</p>
        </div>

        <div class="footer-info">
          <div>
            <p><strong>Wikusama Hotel</strong></p>
            <p>Alamat: Jl. Danau Ranau, Sawojajar, Kec. Kedungkandang, Kota Malang, Jawa Timur 65139 </p>
            <p>Telepon: +62 341-327-777</p>
          </div>
        </div>
      </div>
    </body>
  </html>
`);

      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        navigate("/"); // Redirect ke halaman utama setelah mencetak
      };
    } catch (error) {
      console.error(
        "Error generating order:",
        error.response ? error.response.data : error.message
      );
      alert(
        "Gagal membuat pesanan. Silakan periksa data atau coba lagi nanti."
      );
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative p-6 bg-gray-100">
        <button
          className="absolute top-0 left-[-10px] px-6 py-3 mt-4"
          onClick={() => navigate(-1)}
        >
          <IoChevronBack className="text-2xl" />
        </button>

        <div className="flex flex-col md:flex-row justify-center items-start space-y-6 md:space-y-0 md:space-x-4 w-full">
          <div className="flex-[2] max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-red-800 p-4">
              <h1 className="text-white text-3xl font-bold text-center">
                {roomType || "Wikusama Hotel"}
              </h1>
            </div>
            <div className="relative" style={{ height: "300px" }}>
              <img
                src={`https://ukkhotel.smktelkom-mlg.sch.id/${img}`}
                alt="Hotel room"
                className="w-full h-full object-cover"
                style={{ objectPosition: "center" }}
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <h2 className="text-gray-700 font-medium">Check-in</h2>
                  <p className="text-gray-900 font-bold">{startDate}</p>
                  <p className="text-gray-500">Dari 14:00</p>
                </div>
                <div className="text-center">
                  <h2 className="text-gray-700 font-medium">
                    {totalNights} malam
                  </h2>
                </div>
                <div className="text-center">
                  <h2 className="text-gray-700 font-medium">Check-out</h2>
                  <p className="text-gray-900 font-bold">{endDate}</p>
                  <p className="text-gray-500">Sebelum 12:00</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-gray-700">
                    <span>Jumlah Kamar</span>
                  </div>
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      className="bg-gray-300 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center"
                      onClick={handleDecrement}
                    >
                      -
                    </button>
                    <span className="text-xl font-bold">{roomCount}</span>
                    <button
                      className="bg-gray-300 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center"
                      onClick={handleIncrement}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-gray-700">
                    <span>Total Harga Kamar</span>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 text-xl font-bold">
                      {totalPrice.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-[1] bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h1 className="text-xl font-bold mb-4">Rincian Harga</h1>
            <div className="flex justify-between mb-3">
              <span>Harga Kamar (per malam)</span>
              <span>
                {price.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </span>
            </div>
            <div className="flex justify-between mb-3">
              <span>Total Malam</span>
              <span>{totalNights}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span>Jumlah Kamar</span>
              <span>{roomCount}</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Harga</span>
              <span>
                {totalPrice.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </span>
            </div>
            <button
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full w-full"
              onClick={() => setShowPopup(true)}
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Masukkan Detail Anda</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Nama:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Guest Name:</label>
              <input
                type="guest"
                value={guest}
                onChange={(e) => setGuest(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handlePopupSubmit}
              >
                Kirim
              </button>
              <button
                className="ml-2 text-gray-700 font-bold py-2 px-4 rounded"
                onClick={() => setShowPopup(false)}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Pemesanan;
