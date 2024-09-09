const fs = require('fs');
const mysql = require('mysql2/promise');  // Use mysql2/promise for async/await

// Main function to execute the database queries
async function main() {
  // MySQL connection setup
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lalajoeuydb',
  });

  // Function to retrieve movie_id from the database based on the movie title
  async function getMovieIdByTitle(title) {
    const query = 'SELECT id FROM movies WHERE title = ? LIMIT 1';
    try {
      const [rows] = await connection.execute(query, [title]);
      if (rows.length > 0) {
        return rows[0].id;  // Return the movie_id
      } else {
        console.log(`Movie title not found: ${title}`);
        return null;  // Return null if no match found
      }
    } catch (err) {
      console.error('Error fetching movie ID:', err);
      return null;  // Return null if an error occurs
    }
  }

  // Main function to process the JSON
  async function generateUserReviewComplete() {
    // Load the user_with_review.json file
    const userData = JSON.parse(fs.readFileSync('user_with_review.json', 'utf8'));

    // Iterate through each user's reviews and fetch movie_id
    for (let user of userData) {
      for (let review of user.reviews) {
        const movieId = await getMovieIdByTitle(review.movie_title);
        if (movieId) {
          // Append movie_id to the review object
          review.movie_id = movieId;
        }
      }
    }

    // Write the updated data to a new file user_review_complete.json
    fs.writeFileSync('user_review_complete.json', JSON.stringify(userData, null, 2));
    console.log('user_review_complete.json has been generated.');
  }

  // Start the process
  try {
    await generateUserReviewComplete();
  } catch (err) {
    console.error('Error during process:', err);
  } finally {
    await connection.end();  // Close the database connection
  }
}

// Execute the main function
main().catch(err => console.error('Fatal Error:', err));
