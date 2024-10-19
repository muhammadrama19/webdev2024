import React, { useEffect, useState } from "react";
import {
  BsCameraReels,
  BsFilm,
  BsGlobeAmericas,
  BsPeopleFill,
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Container, Row, Col, Card } from "react-bootstrap"; // Importing React-Bootstrap components
import "./Home.css";
import Error403 from "../components/error/error403"; // Import the error component

function Home() {
  const [error, setError] = useState(null); // Define error state here
  const [counts, setCounts] = useState({
    movieCount: 0,
    genreCount: 0,
    countryCount: 0,
    awardCount: 0,
  });

  // Fetch data from the backend
  useEffect(() => {
    fetch('http://localhost:8001/dashboard', {
      method: 'GET',
      credentials: 'include' // Include credentials (sessions/cookies)
    })
    .then(response => {
      if (response.status === 403) {
        throw new Error('Forbidden: You do not have permission to view this resource.');
      }
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return response.json();
    })
    .then(data => setCounts(data))
    .catch(err => {
      console.error("Error fetching data:", err);
      if (err.message.includes('Forbidden')) {
        // Handle the forbidden case (e.g., redirect to login or show error message)
        setError('You do not have permission to view this dashboard. Please log in.');
      }
    });
  }, []);
  
  const data = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  ];

  return (
    <Container className="main-container" style={{background: 'var(--main-color)'}} fluid> 
      {error ? (
        <Error403 />
      ) : (
        <>
          <Row className="justify-content-center">
            <Col xs="auto mt-5" style={{color: 'white'}}>
              <h3>DASHBOARD</h3>
            </Col>
          </Row>

          <Row className="main-cards">
            <Col sm={6} md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Movies</Card.Title>
                  <BsCameraReels className="card_icon" />
                  <Card.Text as="h1">{counts.movieCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={6} md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Genres</Card.Title>
                  <BsFilm className="card_icon" />
                  <Card.Text as="h1">{counts.genreCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={6} md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Country</Card.Title>
                  <BsGlobeAmericas className="card_icon" />
                  <Card.Text as="h1">{counts.countryCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col sm={6} md={3}>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Awards</Card.Title>
                  <BsPeopleFill className="card_icon" />
                  <Card.Text as="h1">{counts.awardCount}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="charts mt-4">
            <Col xs={12}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pv" fill="#8884d8" />
                  <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Col>

            <Col xs={12} className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default Home;
