import React, { useState } from "react";
import { Container, Form, Button, InputGroup, Alert, Card, Row, Col } from "react-bootstrap";
import Navbar from "./navbar";
import Footer from "../footer";

function CheckOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const handleSearch = async () => {
    if (!orderNumber) {
      setError("Please enter your order number.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("https://ukkhotel.smktelkom-mlg.sch.id/api/checkorder", {
        method: "POST",
        headers: {
          "makerID": "12",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ order_number: orderNumber }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Order not found or an error occurred.");
      }

      const data = await response.json();
      setOrderData(data.orders.data);
    } catch (error) {
      setError("Order not found or an error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const cardStyle = {
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    padding: "25px",
    backgroundColor: "#f9f9f9",
  };

  const headerStyle = {
    backgroundColor: "#8B0000",
    color: "white",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
    padding: "15px",
  };

  const textStyle = {
    fontSize: "15px",
    color: "#6b6b6b",
    fontWeight: "500",
    marginBottom: "5px",
  };

  const valueStyle = {
    fontSize: "16px",
    color: "#333",
    fontWeight: "600",
  };

  return (
    <>
      <Navbar />
      <Container className="d-flex flex-column justify-content-center align-items-center min-vh-100">
        <div className="text-center mb-4">
          <h3 className="mt-5 mb-3 text-dark">Enter Your Order Number</h3>
          <InputGroup className="mb-2" style={{ maxWidth: "600px" }}>
            <Form.Control
              type="text"
              placeholder="Order number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              isInvalid={!!error}
            />
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
            <Button variant="danger" onClick={handleSearch} disabled={isLoading} className="ml-2 px-4">
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </InputGroup>
        </div>

        <div className="mt-3" style={{ width: "100%", maxWidth: "800px" }}>
          {error && <Alert variant="danger">{error}</Alert>}
          {orderData && (
            <Card className="mt-4" style={cardStyle}>
              <div style={headerStyle}>
                <h5>Order Details</h5>
              </div>
              <Card.Body>
                <Row>
                  <Col md={6} style={{ borderRight: "1px solid #ddd" }}>
                    <Card.Text style={textStyle}>
                      <strong>Order ID:</strong> <span style={valueStyle}>{orderData.order_id}</span>
                    </Card.Text>
                    <Card.Text style={textStyle}>
                      <strong>Order Number:</strong> <span style={valueStyle}>{orderData.order_number}</span>
                    </Card.Text>
                    <Card.Text style={textStyle}>
                      <strong>Customer Name:</strong> <span style={valueStyle}>{orderData.customer_name}</span>
                    </Card.Text>
                    <Card.Text style={textStyle}>
                      <strong>Customer Email:</strong> <span style={valueStyle}>{orderData.customer_email}</span>
                    </Card.Text>
                    <Card.Text style={textStyle}>
                      <strong>Guest Name:</strong> <span style={valueStyle}>{orderData.guest_name}</span>
                    </Card.Text>
                  </Col>
                  <Col md={6}>
                  <Card.Text style={textStyle}>
                      <strong>Order Date:</strong> <span style={valueStyle}>{orderData.order_date}</span>
                    </Card.Text>
                    <Card.Text style={textStyle}>
                      <strong>Check-in Date:</strong> <span style={valueStyle}>{orderData.check_in}</span>
                    </Card.Text>
                    <Card.Text style={textStyle}>
                      <strong>Check-out Date:</strong> <span style={valueStyle}>{orderData.check_out}</span>
                    </Card.Text>
                    <Card.Text style={textStyle}>
                      <strong>Rooms Amount:</strong> <span style={valueStyle}>{orderData.rooms_amount}</span>
                    </Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </div>
        <Footer />
      </Container>
    </>
  );
}

export default CheckOrder;
