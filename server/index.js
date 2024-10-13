require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
// const googleAuth = require('./routes/googleAuth');
const passport= require('./middleware/passport-setup')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const app = express();
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if the request origin is in the allowedOrigins array
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Untuk mengizinkan penggunaan cookie
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());



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


app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Google OAuth login
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// Google OAuth callback
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Mengambil user dari request setelah autentikasi
    const user = req.user;

    // Simpan user ke dalam cookie atau kirim ke frontend melalui URL
    const username = user.username;
    const email = user.email;

    // Redirect ke frontend setelah login dengan parameter username dan email
    res.redirect(`http://localhost:3001/?username=${username}&email=${email}`);
  }
);


// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


app.get('/movies/movie', (req, res) => {
  const { page = 1, limit = 10, yearRange, genre, status, availability, country_release, sort, awards } = req.query;
  const offset = (page - 1) * limit;

  let filterConditions = [];
  let queryParams = [];

  // Handle year range filtering
  if (yearRange) {
    try {
      const range = JSON.parse(yearRange); // Parse the incoming JSON string
      queryParams.push(range.start, range.end); // Push start and end years to params
      filterConditions.push(`m.release_year BETWEEN ? AND ?`);
    } catch (error) {
      console.error("Error parsing yearRange:", error);
      return res.status(400).json({ error: 'Invalid yearRange format' });
    }
  }

  if (req.query.search) {
    filterConditions.push(`m.title LIKE ?`);
    queryParams.push(`%${req.query.search}%`); // Use wildcards for searching
  }

  if (awards) {
    filterConditions.push(`a.awards_name = ?`);
    queryParams.push(awards);
  }

  if (status) {
    filterConditions.push(`s.name = ?`);
    queryParams.push(status);
  }


  if (availability) {
    filterConditions.push(`av.platform_name = ?`);
    queryParams.push(availability);
  }
  if (country_release) {
    filterConditions.push(`c.country_name = ?`);
    queryParams.push(country_release);
  }

  // Main query to fetch movies and genres
  let query = ` 
    SELECT m.id, m.title, m.poster AS src, m.release_year AS year, 
           GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS genres, 
           m.imdb_score AS rating, m.view, c.country_name AS country, a.awards_name AS awards, s.name AS status, av.platform_name AS availability
    FROM movies m
    JOIN movie_genres mg ON m.id = mg.movie_id
    JOIN genres g ON mg.genre_id = g.id
    JOIN movie_countries mc ON m.id = mc.movie_id
    JOIN countries c ON mc.country_id = c.id
    JOIN movie_awards ma ON m.id = ma.movie_id
    JOIN awards a ON ma.awards_id = a.id
    JOIN status s ON m.status_id = s.id
    JOIN availability av ON m.availability_id = av.id
    WHERE 1=1
  `;

  // Apply filters
  if (filterConditions.length) {
    query += ` AND ${filterConditions.join(' AND ')}`;
  }
  

  // Handle genre filtering
  if (genre && genre.trim()) {
    query += ` AND m.id IN (
      SELECT mg.movie_id 
      FROM movie_genres mg 
      JOIN genres g ON mg.genre_id = g.id 
      WHERE g.name = ?
    )`;
    queryParams.push(genre);
  }

  query += ` GROUP BY m.id`;

  if (sort) {
    query += ` ORDER BY m.title ${sort.toUpperCase()}`; 
  } else {
    query += ` ORDER BY m.id`; 
  }

  // Add pagination limits
  query += ` LIMIT ? OFFSET ?`;
  queryParams.push(parseInt(limit), parseInt(offset));

  // Execute the main movie query
  db.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed' });
      return;
    }

    // Slice off LIMIT and OFFSET for the COUNT query
    const countQueryParams = queryParams.slice(0, -2);

    // Count query to get the total number of filtered movies
    let countQuery = ` 
      SELECT COUNT(DISTINCT m.id) AS totalCount 
      FROM movies m
      JOIN movie_genres mg ON m.id = mg.movie_id
      JOIN genres g ON mg.genre_id = g.id
      JOIN movie_countries mc ON m.id = mc.movie_id
      JOIN countries c ON mc.country_id = c.id
      JOIN movie_awards ma ON m.id = ma.movie_id
      JOIN awards a ON ma.awards_id = a.id
      JOIN status s ON m.status_id = s.id 
      JOIN availability av ON m.availability_id = av.id
      WHERE 1=1
    `;

    // Apply filters to count query as well
    if (filterConditions.length) {
      countQuery += ` AND ${filterConditions.join(' AND ')}`;
    }

    if (genre && genre.trim()) {
      countQuery += ` AND m.id IN (
        SELECT mg.movie_id 
        FROM movie_genres mg 
        JOIN genres g ON mg.genre_id = g.id 
        WHERE g.name = ?
      )`;
    }

    // Execute the count query with the correct parameters
    db.query(countQuery, countQueryParams, (countErr, countResults) => {
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


app.get("/search", (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).send("Search query is required");
  }

  // Use MySQL LIKE to find matches in the title or description and join with genres
  const sql = `
    SELECT m.id, m.title, m.poster, m.release_year, m.imdb_score, 
           GROUP_CONCAT(g.name SEPARATOR ', ') AS genres, m.view
    FROM movies m
    JOIN movie_genres mg ON m.id = mg.movie_id
    JOIN genres g ON mg.genre_id = g.id
    WHERE m.title LIKE ?
    GROUP BY m.id
    LIMIT 10
  `;
  const searchTerm = `%${query}%`;
  
  db.query(sql, [searchTerm], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.get('/movies/detail/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT
      movies.id AS movie_id,
      movies.title,
      movies.alt_title,
      countries.id AS country_id,
      countries.country_name,
      movies.release_year,
      movies.imdb_score,
      movies.synopsis,
      movies.view,
      movies.poster,
      movies.background,
      movies.trailer,
      movies.director,
      actors.id AS actor_id,
      actors.name AS actor_name,
      actors.actor_picture,
      movie_actors.role,
      genres.id AS genre_id,
      genres.name AS genre_name,
      awards.id AS awards_id,
      awards.awards_name,
      availability.platform_name AS availability_platform_name,
      status.name AS status_name
    FROM
      movies
    LEFT JOIN
      movie_actors ON movies.id = movie_actors.movie_id
    LEFT JOIN
      actors ON movie_actors.actor_id = actors.id
    LEFT JOIN
      movie_genres ON movies.id = movie_genres.movie_id
    LEFT JOIN
      genres ON movie_genres.genre_id = genres.id
    LEFT JOIN 
      movie_countries ON movies.id = movie_countries.movie_id
    LEFT JOIN
      countries ON movie_countries.country_id = countries.id
    LEFT JOIN 
      movie_awards ON movies.id = movie_awards.movie_id
    LEFT JOIN
      awards ON movie_awards.awards_id = awards.id
    LEFT JOIN
    availability ON movies.availability_id = availability.id 
    LEFT JOIN
    status ON movies.status_id = status.id
    WHERE
      movies.id = ?
  `;
  
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Movie not found' });
      return;
    }

    // Process results to structure them
    const movie = {
      id: results[0].movie_id,
      title: results[0].title,
      alt_title: results[0].alt_title,
      release_year: results[0].release_year,
      imdb_score: results[0].imdb_score,
      synopsis: results[0].synopsis,
      view: results[0].view,
      poster: results[0].poster,
      background: results[0].background,
      trailer: results[0].trailer,
      director: results[0].director,
      genre: [],
      countries: [],
      actors: [],
      awards: [],
      availability: results[0].availability_platform_name,
      status: results[0].status_name
    };

    const genreMap = new Map();
    const countryMap = new Map();  // Added for country
    const actorMap = new Map();
    const awardMap = new Map();

    results.forEach(row => {
      // Handle genres
      if (row.genre_id && !genreMap.has(row.genre_id)) {
        genreMap.set(row.genre_id, {
          id: row.genre_id,
          name: row.genre_name
        });
      }

      // Handle countries (many-to-many)
      if (row.country_id && !countryMap.has(row.country_id)) {
        countryMap.set(row.country_id, {
          id: row.country_id,
          name: row.country_name
        });
      }

      // Handle actors
      if (row.actor_id && !actorMap.has(row.actor_id)) {
        actorMap.set(row.actor_id, {
          id: row.actor_id,
          name: row.actor_name,
          role: row.role,
          actor_picture: row.actor_picture
        });
      }

      // Handle awards
      if (row.awards_id && !awardMap.has(row.awards_id)) {
        awardMap.set(row.awards_id, {
          id: row.awards_id,
          name: row.awards_name
        });
      }
    });

    movie.genre = Array.from(genreMap.values());
    movie.countries = Array.from(countryMap.values()); // Added for country
    movie.actors = Array.from(actorMap.values());
    movie.awards = Array.from(awardMap.values());

    res.json(movie);
  });
});




//fetch movie review
app.get('/movies/detail/review/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT
      reviews.id AS review_id,
      users.id AS user_id,
      users.username AS user_name,
      users.profile_picture AS user_picture,
      reviews.content,
      reviews.rating,
      reviews.created_at
    FROM
      reviews
    JOIN
      users ON users.id = reviews.user_id
    WHERE
      reviews.movie_id = ?
  `;
  
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    res.json(results);
  });
});




//fetch all filter criteria

app.get('/filters', async (req, res) => {
  const queries = {
    years: 'SELECT MIN(release_year) AS minYear, MAX(release_year) AS maxYear FROM movies',
    genres: 'SELECT id, name FROM genres ORDER BY name ASC',
    awards: 'SELECT id, awards_name FROM awards ORDER BY awards_name ASC',
    countries: 'SELECT id, country_name FROM countries ORDER BY country_name ASC',
    availability: 'SELECT id, platform_name FROM availability ORDER BY platform_name ASC',
    status: 'SELECT id, name FROM status ORDER BY name ASC',
  };

  const results = {};

  try {
    // Fetch years first to calculate decades
    const [yearRows] = await db.promise().query(queries.years);
    
    if (yearRows.length) {
      const minYear = yearRows[0].minYear;
      const maxYear = yearRows[0].maxYear;
      
     
      const different = minYear % 10;
      const normalizedMinYear = minYear - different; 
      const decades = [];

      for (let year = normalizedMinYear; year <= maxYear; year += 10) {
        decades.push({
          start: year,
          end: year + 10, 
        });
      }

      results.years = decades; 
    } else {
      results.years = [];
    }

    // Fetch genres
    const [genreRows] = await db.promise().query(queries.genres);
    results.genres = genreRows.map(row => ({
      id: row.id,
      name: row.name,
    }));

    // Fetch awards
    const [awardRows] = await db.promise().query(queries.awards);
    results.awards = awardRows.map(row => ({
      id: row.id,
      name: row.awards_name,
    }));

    // Fetch countries
    const [countryRows] = await db.promise().query(queries.countries);
    results.countries = countryRows.map(row => ({
      id: row.id,
      name: row.country_name,
    }));

    // Fetch availability
    const [availabilityRows] = await db.promise().query(queries.availability);
    results.availability = availabilityRows.map(row => ({
      id: row.id,
      name: row.platform_name,
    }));

    // Fetch status
    const [statusRows] = await db.promise().query(queries.status);
    results.status = statusRows.map(row => ({
      id: row.id,
      name: row.name,
    }));

    res.json(results); 
  } catch (error) {
    console.error('Error fetching filters:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





// Fetch top 10 highest-rated movies
app.get('/top-rated', (req, res) => {
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

app.get('/featured', (req, res) => {
  const query = 'SELECT id, title, background, poster, imdb_score, synopsis FROM movies WHERE release_year=2024 ORDER BY imdb_score DESC LIMIT 10';

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


//CMS

app.get('/dashboard', (req, res) => {
  const queryMovies = 'SELECT COUNT(*) AS movieCount FROM movies';
  const queryGenres = 'SELECT COUNT(*) AS genreCount FROM genres';
  const queryCountries = 'SELECT COUNT(*) AS countryCount FROM countries';
  const queryAwards = 'SELECT COUNT(*) AS awardCount FROM users';

  // Menjalankan query secara berurutan menggunakan promise
  const getMoviesCount = () => new Promise((resolve, reject) => {
    db.query(queryMovies, (err, results) => {
      if (err) reject(err);
      else resolve(results[0].movieCount);
    });
  });

  const getGenresCount = () => new Promise((resolve, reject) => {
    db.query(queryGenres, (err, results) => {
      if (err) reject(err);
      else resolve(results[0].genreCount);
    });
  });

  const getCountriesCount = () => new Promise((resolve, reject) => {
    db.query(queryCountries, (err, results) => {
      if (err) reject(err);
      else resolve(results[0].countryCount);
    });
  });

  const getAwardsCount = () => new Promise((resolve, reject) => {
    db.query(queryAwards, (err, results) => {
      if (err) reject(err);
      else resolve(results[0].awardCount);
    });
  });

  // Menggunakan Promise.all untuk menjalankan semua query secara paralel
  Promise.all([getMoviesCount(), getGenresCount(), getCountriesCount(), getAwardsCount()])
    .then(([movieCount, genreCount, countryCount, awardCount]) => {
      const response = {
        movieCount,
        genreCount,
        countryCount,
        awardCount,
      };
      res.json(response);
    })
    .catch(err => {
      console.error('Error executing query:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});



app.get('/movie-list', (req, res) => {
  const { status } = req.query; // Ambil query parameter status dari request

  let query = `
    SELECT
      m.status, 
      m.id, 
      m.title, 
      GROUP_CONCAT(DISTINCT ac.name SEPARATOR ', ') AS Actors,
      GROUP_CONCAT(DISTINCT g.name SEPARATOR ', ') AS Genres,
      m.synopsis
    FROM movies m
    JOIN movie_actors mac ON mac.movie_id = m.id
    JOIN actors ac ON ac.id = mac.actor_id
    JOIN movie_genres mg ON mg.movie_id = m.id
    JOIN genres g ON g.id = mg.genre_id
  `;

  // Tambahkan filter berdasarkan status jika parameter status ada
  if (status) {
    query += ` WHERE m.status = ${db.escape(status)}`; // Escape parameter status untuk menghindari SQL injection
  }

  query += ` GROUP BY m.id`;

  // Eksekusi query dan kirim hasil ke frontend
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);  
  });
});


app.get('/users', (req, res) => {
  const query = `
    SELECT id, username, role, email FROM users
  `;

  // Eksekusi query dan kirim hasil ke frontend
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);  
  });
});



app.get('/actors', (req, res) => {
  const query = `
    SELECT 
      a.id, 
      a.name, 
      a.birthdate, 
      c.country_name, 
      a.actor_picture 
    FROM 
      actors a
    JOIN 
      countries c
    ON 
      a.country_birth_id = c.id
    ORDER BY 
      a.id ASC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});


app.get('/genres', (req, res) => {
  const query = 'SELECT id, name FROM genres ORDER BY id ASC ';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

app.get('/countries', (req, res) => {
  const query = 'SELECT id, country_name FROM countries ORDER BY id ASC ';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

app.get('/awards', (req, res) => {
  const query = `
    SELECT 
      a.id, 
      a.awards_name, 
      c.country_name,
      a.awards_years
    FROM 
      awards a 
    JOIN 
      countries c 
    ON 
      a.country_id = c.id 
    ORDER BY 
      a.id ASC;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});


app.get('/reviews', (req, res) => {
  const query = `
    SELECT 
      reviews.id AS review_id,
      reviews.content,
      reviews.rating,
      reviews.status,
      reviews.created_at,
      reviews.updated_at,
      movies.title AS movie_title,
      users.username AS user_name
    FROM 
      reviews
    JOIN 
      movies ON reviews.movie_id = movies.id
    JOIN 
      users ON reviews.user_id = users.id
    ORDER BY reviews.id ASC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});


//CRUD

//ADD MOVIES
app.post('/add-drama', (req, res) => {
  const {
    poster,
    title,
    alt_title,
    release_year,
    country,
    synopsis,
    availability,
    genres,
    actors,
    trailer,
    award,
    background,
  } = req.body;

  const query = `INSERT INTO dramas (poster, title, alt_title, release_year, country, synopsis, availability, genres, actors, trailer, award, background) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [poster, title, alt_title, release_year, country, synopsis, availability, genres.join(', '), actors.join(', '), trailer, award.join(', '), background], (err, result) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.status(200).json({ message: 'Drama added successfully' });
  });
});


//SET TRASH
app.put('/movie-delete/:id', (req, res) => {
  const movieId = req.params.id;

  const query = `UPDATE movies SET status = 0 WHERE id = ?`;

  db.query(query, [movieId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(200).json({ message: 'Movie moved to trash successfully' });
  });
});

//PERMANENT DELETE
// Endpoint untuk mengubah status menjadi 3 (permanen delete dari trash)
app.put('/movie-permanent-delete/:id', (req, res) => {
  const movieId = req.params.id;

  const query = `UPDATE movies SET status = 3 WHERE id = ?`;

  db.query(query, [movieId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(200).json({ message: 'Movie permanently deleted successfully' });
  });
});


//RESTORE
app.put('/movie-restore/:id', (req, res) => {
  const movieId = req.params.id;
  const query = `UPDATE movies SET status = 1 WHERE id = ?`;

  db.query(query, [movieId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.status(200).json({ message: 'Movie restored successfully' });
  });
});

//LOGIN 
app.post('/login', (req, res) => {
  const query = "SELECT * FROM users WHERE email = ?";
  
  db.query(query, [req.body.email], (err, data) => {
    if (err) {
      return res.json({ Message: "Server Side Error" });
    }

    if (data.length > 0) {
      const user = data[0];

      bcrypt.compare(req.body.password, user.password, (err, result) => {
        if (err) {
          return res.json({ Message: "Error comparing password" });
        }

        if (result) {
          const token = jwt.sign(
            { username: user.username, email: user.email, role: user.role }, // Tambahkan role ke JWT
            "our-jsonwebtoken-secret-key",
            { expiresIn: '1d' }
          );

          res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });

          // Kirim username, email, dan role ke frontend
          return res.json({
            Status: "Login Success",
            username: user.username,
            email: user.email,
            role: user.role
          });
        } else {
          return res.json({ Message: "Incorrect Password" });
        }
      });
    } else {
      return res.json({ Message: "No Records existed" });
    }
  });
});



//REGISTER
app.post('/register', (req, res) => {
  console.log("Incoming request body:", req.body); // Debugging

  const sql = "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";
  const saltRounds = 10;

  bcrypt.hash(req.body.password, saltRounds, (err, hashedPassword) => {
    if (err) {
      return res.json({ message: "Error hashing password", success: false });
    }

    const values = [req.body.username, req.body.email, hashedPassword];

    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Error saving user:", err); // Debugging
        return res.json({ message: "Username/Password Sudah Terdaftar, silahkan buat yang lain", success: false });
      }
      console.log("User registered successfully:", data); // Debugging
      return res.json({ message: "Registration successful", success: true });
    });
  });
});




// Starting the server
const PORT = 8001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

