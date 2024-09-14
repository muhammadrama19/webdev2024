const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors()); 
app.use(express.json()); 

// MySQL connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", 
  database: "lalajoeuydb"
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});

// Fetch movies with pagination
app.get('/movies/movie', (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const query = `
    SELECT m.id, m.title, m.poster AS src, m.release_year AS year, 
           GROUP_CONCAT(g.name SEPARATOR ', ') AS genres, 
           m.imdb_score AS rating, m.view 
    FROM movies m
    JOIN movie_genres mg ON m.id = mg.movie_id
    JOIN genres g ON mg.genre_id = g.id
    GROUP BY m.id
    LIMIT ? OFFSET ?;
  `;

  db.query(query, [parseInt(limit), parseInt(offset)], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed' });
      return;
    }

    const countQuery = 'SELECT COUNT(*) AS totalCount FROM movies';
    
    db.query(countQuery, (countErr, countResults) => {
      if (countErr) {
        res.status(500).json({ error: 'Failed to get movie count' });
        return;
      }

      const totalCount = countResults[0].totalCount;
      res.json({
        movies: results, 
        totalCount,
      });
    });
  });
});

// Fetch top 10 highest-rated movies
app.get('/movies/top-rated', (req, res) => {
  const query = 'SELECT title, background, imdb_score FROM movies ORDER BY imdb_score DESC LIMIT 15';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    
    res.json(results); // Send the top 10 movies to the front-end
  });
});

app.get('/movies/featured', (req, res) => {
  const query = 'SELECT title, background, poster, imdb_score, synopsis FROM movies WHERE release_year=2024 ORDER BY imdb_score DESC LIMIT 20';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    
    res.json(results); // Send the top 10 movies to the front-end
  });
}
);

//Fetch correspond movie detail
app.get('/movies/moviedetail', (req,res) => {
  const query = ''

})



// Starting the server
const PORT = 8001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
