import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import Sidebar from "./sideBar";
import Footer from "../footer";

function DataKamar() {
  const [rooms, setRooms] = useState([]); // State untuk data kamar
  const [showModal, setShowModal] = useState(false); // State untuk menampilkan modal
  const [roomDetails, setRoomDetails] = useState({
    id: null,
    room_number: "",
    type_id: "",
    status: "Available", // Default status kamar
  }); // State untuk detail kamar

  // Fungsi untuk fetch data kamar dari API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`https://ukkhotel.smktelkom-mlg.sch.id/api/room`, {
          headers: {
            "makerID": "12",
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        });
        const data = await response.json();
        console.log(data); // Debugging untuk melihat data dari API

        setRooms(data || []); // Set data kamar
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  // Fungsi untuk menyimpan data kamar (POST untuk tambah, PUT untuk update)
  const handleSaveRoom = async () => {
    const method = roomDetails.id ? 'PUT' : 'POST'; // Tentukan metode berdasarkan ada tidaknya ID
    const url = roomDetails.id
      ? `https://ukkhotel.smktelkom-mlg.sch.id/api/room/${roomDetails.id}` // PUT jika ada ID
      : `https://ukkhotel.smktelkom-mlg.sch.id/api/room`; // POST untuk menambah kamar baru

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "makerID": "12",
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          room_number: roomDetails.room_number,
          type_id: roomDetails.type_id,
          status: roomDetails.status,
        }), // Kirim data ke API
      });

      const result = await response.json();

      if (response.ok) {
        if (roomDetails.id) {
          // Update state rooms jika berhasil edit
          setRooms(rooms.map((room) =>
            room.room_id === roomDetails.id ? { ...room, ...roomDetails } : room
          ));
        } else {
          // Tambah kamar baru jika POST
          setRooms([...rooms, result.data]);
        }

        setShowModal(false); // Tutup modal setelah simpan
        setRoomDetails({ id: null, room_number: "", type_id: "", status: "Available" }); // Reset form
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  // Fungsi untuk mengedit kamar (menampilkan data kamar di modal)
  const handleEditRoom = (room) => {
    setRoomDetails({
      id: room.room_id,
      room_number: room.room_number,
      type_id: room.type_id,
      status: room.status,
    });
    setShowModal(true);
  };

  // Fungsi untuk menghapus kamar
  const handleDeleteRoom = async (id) => {
    try {
      const response = await fetch(`https://ukkhotel.smktelkom-mlg.sch.id/api/room/${id}`, {
        method: 'DELETE',
        headers: {
          "makerID": "12",
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.ok) {
        // Jika berhasil hapus, perbarui state
        setRooms(rooms.filter((room) => room.room_id !== id)); // Hapus dari state
      } else {
        const result = await response.json();
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  return (
    <div className="d-flex flex-column vh-100" style={{ backgroundColor: "#f0f0f0" }}>
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <div className="flex-grow-1 p-3" style={{ backgroundColor: "#f0f0f0" }}>
          <Container fluid>
            <Row className="mb-4">
              <Col>
                <h1 style={{ color: "#B22222" }}>Dashboard Data Kamar</h1>
              </Col>
            </Row>

            {/* Section untuk menampilkan data kamar */}
            <Row className="mt-15">
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>Data Kamar</Card.Title>
                    <Button
                      onClick={() => setShowModal(true)}
                      className="mb-3"
                      style={{ backgroundColor: "#B22222", color: "white" }}
                    >
                      Tambah Kamar
                    </Button>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Id</th>
                          <th>Nomor Kamar</th>
                          <th>Tipe Kamar</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rooms.map((room) => (
                          <tr key={room.room_id}>
                            <td>{room.room_id}</td>
                            <td>{room.room_number}</td>
                            <td>{room.type_id}</td>
                            <td>
                              <Button variant="warning" onClick={() => handleEditRoom(room)}>
                                Edit
                              </Button>{" "}
                              <Button variant="danger" onClick={() => handleDeleteRoom(room.room_id)}>
                                Hapus
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* Modal untuk tambah/edit kamar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{roomDetails.id ? "Edit Kamar" : "Tambah Kamar"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nomor Kamar</Form.Label>
              <Form.Control
                type="text"
                value={roomDetails.room_number}
                onChange={(e) => setRoomDetails({ ...roomDetails, room_number: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Tipe Kamar</Form.Label>
              <Form.Control
                type="number"
                value={roomDetails.type_id}
                onChange={(e) => setRoomDetails({ ...roomDetails, type_id: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSaveRoom}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
}

export default DataKamar;
