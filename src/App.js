import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

import NavbarAdmin from "./component/admin/sideBar";
import Login from "./component/login";
import Beranda from "./component/tamu/beranda"; 
import Register from "./component/register";
import Footer from "./component/footer";
import Kamar from "./component/tamu/kamar";
import Pemesanan from "./component/tamu/pemesanan";
import DataKamar from "./component/admin/dataKamar";
import TipeKamar from "./component/admin/TipeKamar";
import User from"./component/admin/user";
import DataPemesanan from "./component/resepsionis/dataPemesanan";
import checkOrder from "./component/tamu/checkOrder";
import Logout from "./component/logout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/" Component={Beranda} /> 
        <Route path="/register" Component={Register} /> 
        <Route path="/kamar" Component={Kamar} /> 
        <Route path="/footer" Component={Footer} /> 
        <Route path="/pemesanan" Component={Pemesanan} /> 
        <Route path="/resepsionis" Component={DataPemesanan}/>
        <Route path="/admin" Component={DataKamar}/>
        <Route path="/tipekamar" Component={TipeKamar}/>
        <Route path="/user" Component={User}/>
        <Route path="/checkOrder" Component={checkOrder}/>
        <Route path="/logout" Component={Logout}/>
      </Routes>
    </Router>
  );
}

export default App;
