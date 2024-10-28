import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';
import Footer from '../footer';

function Kamar() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const navigate = useNavigate();

  // Fetch all room types from the API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('https://ukkhotel.smktelkom-mlg.sch.id/api/type', {
          headers: {
            "makerID": "12",
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: false,
        });

        if (response.data && Array.isArray(response.data.data)) {
          setRooms(response.data.data);
          setFilteredRooms(response.data.data); // Display all rooms initially
          console.log(response.data.data);
          
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  // Fetch available rooms based on the selected dates
  const fetchAvailableRooms = async () => {
    if (startDate && endDate) {
      try {
        const response = await axios.post('https://ukkhotel.smktelkom-mlg.sch.id/api/datefilter', {
          startDate,
          endDate
        }, {
          headers: {
            "makerID": "12",
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: false,
        });

        if (response.data && Array.isArray(response.data.data)) {
          // The API response is expected to only return room types with available rooms
          const availableRoomIds = response.data.data.map(room => room.type_id);
          const availableRooms = rooms.filter(room => availableRoomIds.includes(room.type_id));
          setFilteredRooms(availableRooms);
        } else {
          console.error('Unexpected data format for available rooms:', response.data);
        }
      } catch (error) {
        console.error('Error fetching available rooms:', error);
      }
    } else {
      // If no dates are provided, show all rooms
      setFilteredRooms(rooms);
    }
  };

  // Trigger fetch for available rooms when both dates are selected
  useEffect(() => {
    fetchAvailableRooms(); // Call the function to fetch available rooms based on selected dates
  }, []);

  // Handle room selection
  const handleSelectRoom = (type_id, roomType, price, img) => {
    navigate('/pemesanan', {
      state: {
        type_id,
        startDate,
        endDate,
        roomType,
        price,
        img,
      },
    });
  };

  return (
    <>
      <Navbar />
      <Container className="my-4">
        <Row>
          <Col md={4}>
            <Card className="p-3">
              <Form>
                <Form.Group controlId="checkin" className="mb-3">
                  <Form.Label>Check-in Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="checkout" className="mb-3">
                  <Form.Label>Check-out Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>

                <Button
                  style={{ backgroundColor: '#B22222' }}
                  className="w-100"
                  onClick={fetchAvailableRooms}
                >
                  Search
                </Button>
              </Form>
            </Card>
          </Col>

          <Col md={8}>
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <Card className="mb-3" key={room.type_id}>
                  <Row noGutters>
                    <Col md={4}>
                      <Card.Img
                        variant="top"
                        src={`https://ukkhotel.smktelkom-mlg.sch.id/${room.photo_path}`}
                        alt={room.type_name}
                      />
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Card.Title>{room.type_name}</Card.Title>
                        <Card.Text>{room.desc}</Card.Text>
                        <h5>{room.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })} per night</h5>
                        <Button
                          style={{ backgroundColor: '#B22222' }}
                          onClick={() => handleSelectRoom(room.type_id, room.type_name, room.price, room.photo_path)}
                        >
                          Pesan Kamar
                        </Button>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              ))
            ) : (
              <p>No rooms found within the selected date range.</p>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default Kamar;
