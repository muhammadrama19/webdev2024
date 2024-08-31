import React from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import './home.scss';
import Navbar from '../components/navbar/navbar';
import DropdownFilter from '../components/filter/dropdownfilter';
import Featured from '../components/featured/featured';
import List from '../components/list/list';
import Card from '../components/card/card';
import ButtonCustom from '../components/button/button';
import SearchInput from '../components/searchInput/search';

const Home = () => {
  const genres = ["Action", "Comedy", "Drama", "Horror"];
  const status = ["Ongoing", "Completed"];
  const availability = ["Available", "Not Available"];
  const awards = ["Best Picture", "Best Actor", "Best Actress", "Best Director"];

  return (
    <div className="home">
      <Featured type="movie" />
      <List />
      <List />

      <Container fluid className="p-4">
      <SearchInput />
    </Container>

      <Container className="dropdown-container">
        <Row className="align-items-center"  tyle={{ borderTop: '1px solid var(--primary-color)' }}>
          <Col xs={12} className="label-filter">
            <span>Filter by:</span>
          </Col>
        </Row>
        <Row className="align-items-center">
          <Col xs={6} sm={6} md={4} lg={3}>
            <DropdownFilter
              label="Year"
              options={["2020-2025", "2015-2020", "2010-2015", "2005-2010"]}
              onSelect={(option) => console.log(option)}
            />
          </Col>
          <Col xs={6} sm={6} md={4} lg={3}>
            <DropdownFilter
              label="Type"
              options={["Series", "Movies"]}
              onSelect={(option) => console.log(option)}
            />
          </Col>
          <Col xs={6} sm={6} md={4} lg={3}>
            <DropdownFilter
              label="Sort By"
              options={["Latest", "Oldest"]}
              onSelect={(option) => console.log(option)}
            />
          </Col>
          <Col xs={6} sm={6} md={4} lg={3}>
            <DropdownFilter
              label="Genre"
              options={genres}
              onSelect={(option) => console.log(option)}
            />
          </Col>
          <Col xs={6} sm={6} md={4} lg={3}>
            <DropdownFilter
              label="Status"
              options={status}
              onSelect={(option) => console.log(option)}
            />
          </Col>
          <Col xs={6} sm={6} md={4} lg={3}>
            <DropdownFilter
              label="Availability"
              options={availability}
              onSelect={(option) => console.log(option)}
            />
          </Col>
          <Col xs={6} sm={6} md={4} lg={3}>
            <DropdownFilter
              label="Award"
              options={awards}
              onSelect={(option) => console.log(option)}
            />
          </Col>
          <Col  xs={6} sm={6} md={4} lg={3}>
          <ButtonCustom className={"mt-3"} variant="primary" onClick={() => alert('Primary Button')}>
        Play
      </ButtonCustom>
          </Col>
        </Row>
      </Container>

      <Container className="card-container mt-5">
        <Row className="justify-content-center">
          {[
            {
              src: "https://image.tmdb.org/t/p/w1280/6PCnxKZZIVRanWb710pNpYVkCSw.jpg",
              title: "Title of the drama 1 that makes two lines",
              year: "2024",
              genres: ['Genre 1', 'Genre 2', 'Genre 3'],
              rating: 3.5,
              views: 19,
            },
            {
              src: "https://image.tmdb.org/t/p/w1280/mmdBbXCs85JxxKyG664KI46rdC3.jpg",
              title: "Title of the drama 1 that makes two lines Title of the drama 1 that makes two lines",
              year: "2024",
              genres: ['Genre 1', 'Genre 2'],
              rating: 3.5,
              views: 19,
            },
            {
              src: "https://image.tmdb.org/t/p/w1280/mmdBbXCs85JxxKyG664KI46rdC3.jpg",
              title: "Title of the drama 1 that makes two lines Title of the drama 1 that makes two lines",
              year: "2024",
              genres: ['Genre 1', 'Genre 2'],
              rating: 3.5,
              views: 19,
            },
            {
              src: "https://image.tmdb.org/t/p/w1280/mmdBbXCs85JxxKyG664KI46rdC3.jpg",
              title: "Title of the drama 1 that makes two lines Title of the drama 1 that makes two lines",
              year: "2024",
              genres: ['Genre 1', 'Genre 2'],
              rating: 3.5,
              views: 19,
            },
            {
              src: "https://image.tmdb.org/t/p/w1280/mmdBbXCs85JxxKyG664KI46rdC3.jpg",
              title: "Title of the drama 1 that makes two lines Title of the drama 1 that makes two lines",
              year: "2024",
              genres: ['Genre 1', 'Genre 2'],
              rating: 3.5,
              views: 19,
            },
            {
              src: "https://image.tmdb.org/t/p/w1280/mmdBbXCs85JxxKyG664KI46rdC3.jpg",
              title: "Title of the drama 1 that makes two lines Title of the drama 1 that makes two lines",
              year: "2024",
              genres: ['Genre 1', 'Genre 2'],
              rating: 3.5,
              views: 19,
            }
            // Add more cards here
          ].map((cardData, index) => (
            <Col key={index} xs={6} sm={6} md={4} lg={3} className="mb-4 d-flex justify-content-center">
              <Card {...cardData} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Home;
