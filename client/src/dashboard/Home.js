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
import "./Home.scss";

function Home() {
  const [counts, setCounts] = useState({
    movieCount: 0,
    genreCount: 0,
    countryCount: 0,
    awardCount: 0,
  });

  const [data, setData] = useState([]);

  // Fetch jumlah movie, genre, country, award
  useEffect(() => {
    fetch('http://localhost:8001/dashboard') // Ganti sesuai URL backend kamu
      .then(response => response.json())
      .then(data => setCounts(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  // Fetch jumlah movie dan genre berdasarkan dekade dari backend
  useEffect(() => {
    fetch('http://localhost:8001/movie-genre-count-by-decade') // Ganti dengan URL endpoint backend kamu
      .then(response => response.json())
      .then(data => setData(data)) // Set data yang diambil dari backend ke state
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  // Custom tooltip formatter function
  const tooltipFormatter = (value, name) => {
    if (name === "movieCount") return [value, "Movies"];
    if (name === "genreCount") return [value, "Genres"];
    return [value, name];
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>

      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>Movies</h3>
            <BsCameraReels className="card_icon" />
          </div>
          <h1>{counts.movieCount}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Genres</h3>
            <BsFilm className="card_icon" />
          </div>
          <h1>{counts.genreCount}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Country</h3>
            <BsGlobeAmericas className="card_icon" />
          </div>
          <h1>{counts.countryCount}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>Awards</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>{counts.awardCount}</h1>
        </div>
      </div>

      <div className="charts">
        {/* BarChart untuk movie dan genre berdasarkan dekade */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            width={500}
            height={300}
            data={data} // Menggunakan data yang diambil dari backend berdasarkan dekade
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="decade" />
            <YAxis />
            <Tooltip formatter={tooltipFormatter} />
            <Legend 
              payload={[
                { value: "Movies", type: "square", id: "ID01", color: "#8884d8" },
                { value: "Genres", type: "square", id: "ID02", color: "#82ca9d" }
              ]}
            />
            <Bar dataKey="movieCount" fill="#8884d8" />
            <Bar dataKey="genreCount" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        {/* LineChart untuk movie dan genre berdasarkan dekade */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            width={500}
            height={300}
            data={data} // Menggunakan data yang diambil dari backend berdasarkan dekade
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="decade" />
            <YAxis />
            <Tooltip formatter={tooltipFormatter} />
            <Legend 
              payload={[
                { value: "Movies", type: "line", id: "ID01", color: "#8884d8" },
                { value: "Genres", type: "line", id: "ID02", color: "#82ca9d" }
              ]}
            />
            <Line
              type="monotone"
              dataKey="movieCount"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="genreCount" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Home;
