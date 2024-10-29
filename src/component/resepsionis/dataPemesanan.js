import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";

import Sidebar from "./sideBar";
import Footer from "../footer";

function DataPemesanan() {
  const [orders, setOrders] = useState([]); // Initialize as an empty array
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guestName, setGuestName] = useState(""); // State for guest name filter
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("Fetching orders...");
        const response = await fetch(
          "https://ukkhotel.smktelkom-mlg.sch.id/api/orders",
          {
            headers: {
              makerID: "12", // add makerID in the header
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch orders. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response: ", data); // Debug: log the fetched data

        setOrders(data.data || []); // Adjust based on the API's response structure
        setLoading(false); // Set loading to false after fetching data
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message || "Unknown error occurred");
        setLoading(false); // Stop loading if there's an error
      }
    };

    fetchOrders();
  }, []); // Only fetch once when the component mounts

  const updateOrderStatus = async (id, newStatus) => {
    try {
        console.log(`Updating status for order ${id} to ${newStatus}`);

        const response = await fetch(
            `https://ukkhotel.smktelkom-mlg.sch.id/api/orders/status/${id}`,
            {
                method: "PUT",
                headers: {
                    makerID: "12", // Ensure makerID is correct
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                body: JSON.stringify({ status: newStatus }), // Send the new status in the body
            }
        );

        if (!response.ok) {
            const errorText = await response.text(); // Get the error response body
            console.error("Server Response:", errorText); // Log the error response
            const errorMessage = `Failed to update order status. Status: ${response.status} - ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const updatedOrder = await response.json();
        console.log("Order updated successfully:", updatedOrder);

        // Update local state after the status is successfully updated
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.order_id === id ? { ...order, status: newStatus } : order
            )
        );
    } catch (error) {
        console.error("Error updating order status:", error);
        alert(`Error updating order status: ${error.message}`);
    }
  };

  // Filter orders based on status, dates, and guest name
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "Semua" || order.status === filterStatus;
    const matchesName = guestName === "" || order.guest_name.toLowerCase().includes(guestName.toLowerCase());
    
    // If no dates are provided, include all orders
    if (!startDate && !endDate) {
      return matchesStatus && matchesName;
    }

    // Check if the order's check-in and check-out dates fall within the selected range
    const checkInDate = new Date(order.check_in);
    const checkOutDate = new Date(order.check_out);

    const withinCheckIn = startDate ? checkInDate >= new Date(startDate) : true;
    const withinCheckOut = endDate ? checkOutDate <= new Date(endDate) : true;

    return matchesStatus && matchesName && withinCheckIn && withinCheckOut;
  });

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
                <h1 style={{ color: "#B22222" }}>Dashboard Data Pemesanan</h1>
              </Col>
            </Row>

            {/* Filter Pesanan */}
            <Row className="mb-4">
              {/* Filter by Date */}
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Filter Tanggal Check-In</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label>Filter Tanggal Check-Out</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>

              {/* Filter by Guest Name */}
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Filter Nama Tamu</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nama Tamu"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Tabel Pesanan */}
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <Card.Title>Data Pemesanan</Card.Title>

                    {/* Handling loading state */}
                    {loading ? (
                      <div className="text-center">
                        <Spinner animation="border" role="status">
                          <span className="sr-only">Loading...</span>
                        </Spinner>
                      </div>
                    ) : error ? (
                      <Alert variant="danger">Error: {error}</Alert>
                    ) : (
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>Id</th>
                            <th>Customer Name</th>
                            <th>Customer Email</th> {/* New Email Column */}
                            <th>Guest Name</th>
                            <th>Order Number</th>
                            <th>Check-In</th>
                            <th>Check-Out</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((order) => (
                            <tr key={order.order_id}>
                              <td>{order.order_id}</td>
                              <td>{order.customer_name}</td>
                              <td>{order.customer_email}</td> 
                              <td>{order.guest_name}</td> 
                              <td>{order.order_number}</td>
                              <td>{order.check_in}</td>
                              <td>{order.check_out}</td>
                              <td>{order.status}</td>
                              <td>
                                <Form.Control
                                  as="select"
                                  value={order.status}
                                  onChange={(e) =>
                                    updateOrderStatus(
                                      order.order_id,
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="New">New</option>
                                  <option value="Check In">Check-In</option>
                                  <option value="Check Out">Check-Out</option>
                                </Form.Control>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DataPemesanan;
