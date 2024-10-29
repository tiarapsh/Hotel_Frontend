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

function TipeKamar() {
  const [types, setTypes] = useState([]); // State untuk data tipe kamar
  const [showModal, setShowModal] = useState(false); // State untuk menampilkan modal
  const [roomDetails, setRoomDetails] = useState({
    id: null,
    type_name: "",
    price: "",
    desc: "",
    image: null, // Menyimpan file gambar
  });

  // Fungsi untuk fetch data tipe kamar dari API
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch(
          `https://ukkhotel.smktelkom-mlg.sch.id/api/type`,
          {
            headers: {
              makerID: "12",
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        const data = await response.json();
        console.log(data); // Log API response untuk debugging

        setTypes(data.data || []); // Set data tipe kamar atau array kosong jika data tidak ada
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };

    fetchTypes();
  }, []);

  const handleSaveRoom = async () => {
    const method = roomDetails.id ? "POST" : "POST";
    const url = roomDetails.id
      ? `https://ukkhotel.smktelkom-mlg.sch.id/api/type/${roomDetails.id}`
      : `https://ukkhotel.smktelkom-mlg.sch.id/api/type`;

    // Validation checks
    if (
      !roomDetails.type_name ||
      !roomDetails.price ||
      !roomDetails.desc ||
      !roomDetails.image
    ) {
      alert("All fields, including the photo, are required.");
      return;
    }

    // Validate the file type
    if (roomDetails.image) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(roomDetails.image.type)) {
        alert("Please upload a valid image file (JPEG, PNG, GIF).");
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("type_name", roomDetails.type_name);
      formData.append("price", roomDetails.price);
      formData.append("desc", roomDetails.desc);
      formData.append("photo", roomDetails.image);

      const response = await fetch(url, {
        method: method,
        headers: {
          makerID: "12",
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        if (roomDetails.id) {
          // Update existing room type
          setTypes(
            types.map((type) =>
              type.type_id === roomDetails.id ? result.data : type
            )
          );
        } else {
          // Add new room type
          setTypes((prevTypes) => [...prevTypes, result.data]);
        }

        setShowModal(false);
        setRoomDetails({
          id: null,
          type_name: "",
          price: "",
          desc: "",
          image: null,
        });
      } else {
        console.error("Error:", result.message);
        if (result.errors && result.errors.photo) {
          alert(result.errors.photo);
        } else {
          alert("An error occurred while uploading the photo.");
        }
      }
      window.location.reload();
    } catch (error) {
      console.error("Error saving room:", error);
    }
  };

  // Fungsi untuk mengedit tipe kamar (menampilkan detail di modal)
  const handleEditRoom = (room) => {
    setRoomDetails({
      id: room.type_id,
      type_name: room.type_name,
      price: room.price,
      desc: room.desc,
      image: null, // Tidak mengisi file image saat edit, kecuali user mengupload ulang
    });
    setShowModal(true);
  };

  // Fungsi untuk menghapus tipe kamar secara dinamis menggunakan type_id
  const handleDeleteRoom = async (id) => {
    try {
      const response = await fetch(
        `https://ukkhotel.smktelkom-mlg.sch.id/api/type/${id}`,
        {
          method: "DELETE",
          headers: {
            makerID: "12",
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.ok) {
        // Jika berhasil hapus, perbarui state
        setTypes(types.filter((room) => room.type_id !== id)); // Hapus dari state
      } else {
        const result = await response.json();
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  return (
    <div
      className="d-flex flex-column vh-100"
      style={{ backgroundColor: "#f0f0f0" }}
    >
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <div className="flex-grow-1 p-3" style={{ backgroundColor: "#f0f0f0" }}>
          <Container fluid>
            <Row className="mb-4">
              <Col>
                <h1 style={{ color: "#B22222" }}>Dashboard Tipe Kamar</h1>
              </Col>
            </Row>

            {/* Section untuk menampilkan data tipe kamar */}
            <Row className="mt-15">
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>Data Tipe Kamar</Card.Title>
                    <Button
                      onClick={() => setShowModal(true)}
                      className="mb-3"
                      style={{ backgroundColor: "#B22222", color: "white" }}
                    >
                      Tambah Tipe Kamar
                    </Button>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Id</th>
                          <th>Nama Kamar</th>
                          <th>Harga</th>
                          <th>Description</th>
                          <th>Gambar</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {types.map((room) => (
                          <tr key={room.type_id}>
                            <td>{room.type_id}</td>
                            <td>{room.type_name}</td>
                            <td>{room.price}</td>
                            <td>{room.desc}</td>
                            <td>{room.photo_name}</td>

                            <td>
                              <Button
                                variant="warning"
                                onClick={() => handleEditRoom(room)}
                              >
                                Edit
                              </Button>{" "}
                              <Button
                                variant="danger"
                                onClick={() => handleDeleteRoom(room.type_id)}
                              >
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

      {/* Modal untuk Tambah/Edit Tipe Kamar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {roomDetails.id ? "Edit Tipe Kamar" : "Tambah Tipe Kamar"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nama Kamar</Form.Label>
              <Form.Control
                type="text"
                value={roomDetails.type_name}
                onChange={(e) =>
                  setRoomDetails({ ...roomDetails, type_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Harga</Form.Label>
              <Form.Control
                type="number"
                value={roomDetails.price}
                onChange={(e) =>
                  setRoomDetails({ ...roomDetails, price: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                type="text"
                value={roomDetails.desc}
                onChange={(e) =>
                  setRoomDetails({ ...roomDetails, desc: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Upload Gambar</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setRoomDetails({ ...roomDetails, image: e.target.files[0] })
                }
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

export default TipeKamar;
