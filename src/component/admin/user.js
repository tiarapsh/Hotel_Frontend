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

function User() {
  const [users, setUser] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userDetails, setUserDetails] = useState({
    id: null,
    name: "",
    email: "",
    role: "Receptionist", // Set default role to match API expected values
    password: "",
    passwordConfirmation: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`https://ukkhotel.smktelkom-mlg.sch.id/api/user`, {
          headers: {
            "makerID": "12",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        });
        const data = await response.json();
        console.log(data);

        setUser(Array.isArray(data.user) ? data.user : []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSaveUser = async () => {
    if (!userDetails.id && userDetails.password !== userDetails.passwordConfirmation) {
      alert("Password and confirmation do not match.");
      return;
    }

    const userData = {
      name: userDetails.name,
      email: userDetails.email,
      role: userDetails.role, // Only send expected values (Admin/Receptionist)
    };

    if (!userDetails.id || (userDetails.password && userDetails.password === userDetails.passwordConfirmation)) {
      userData.password = userDetails.password;
      userData.password_confirmation = userDetails.passwordConfirmation;
    }

    const method = userDetails.id ? "PUT" : "POST";
    const url = userDetails.id
      ? `https://ukkhotel.smktelkom-mlg.sch.id/api/user/${userDetails.id}`
      : `https://ukkhotel.smktelkom-mlg.sch.id/api/register`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "makerID": "12",
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("API Response:", result);

        if (result.user) {
          if (userDetails.id) {
            setUser(users.map(user => (user.id === userDetails.id ? { ...user, ...result.user } : user)));
          } else {
            setUser([...users, result.user]);
          }

          setShowModal(false);
          setUserDetails({ id: null, name: "", email: "", role: "Receptionist", password: "", passwordConfirmation: "" });
        } else {
          alert("User data not returned from the server.");
        }
      } else {
        const error = await response.json();
        console.error("Error saving user:", error);
        alert("Error saving user: " + JSON.stringify(error));
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleEditUser = (user) => {
    setUserDetails({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
      passwordConfirmation: "",
    });
    setShowModal(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch(`https://ukkhotel.smktelkom-mlg.sch.id/api/user/${id}`, {
        method: "DELETE",
        headers: {
          "makerID": "12",
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.ok) {
        setUser(users.filter((user) => user.id !== id));
      } else {
        const error = await response.json();
        console.error("Error deleting user:", error);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
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
                <h1 style={{ color: "#B22222" }}>Dashboard Data User</h1>
              </Col>
            </Row>

            <Row className="mt-15">
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>Data User</Card.Title>
                    <Button
                      onClick={() => setShowModal(true)}
                      className="mb-3"
                      style={{ backgroundColor: "#B22222", color: "white" }}
                    >
                      Tambah User
                    </Button>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Id</th>
                          <th>Nama</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(users) && users.length > 0 ? (
                          users.map((user) => (
                            <tr key={user.id}>
                              <td>{user.id}</td>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{user.role}</td>
                              <td>
                                <Button
                                  variant="warning"
                                  onClick={() => handleEditUser(user)}
                                  style={{ marginRight: "10px" }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="danger"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  Hapus
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">No users available</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {userDetails.id ? "Edit User" : "Tambah User"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                value={userDetails.name}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={userDetails.email}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={userDetails.role}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, role: e.target.value })
                }
              >
                <option value="Admin">Admin</option>
                <option value="Receptionist">Receptionist</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password (leave blank if not changing)</Form.Label>
              <Form.Control
                type="password"
                value={userDetails.password}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, password: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Konfirmasi Password</Form.Label>
              <Form.Control
                type="password"
                value={userDetails.passwordConfirmation}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, passwordConfirmation: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveUser}>
            {userDetails.id ? "Update User" : "Save User"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </div>
  );
}

export default User;
