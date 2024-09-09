const userReduced = require('./user_reduced.json');
const updatedMovies = require('./updated_movies.json');

// Initialize an array to store the result
let userWithReviews = [];

userReduced.forEach(user => {
    let userData = {
        "user_profile_pic": user.user_profile_pic,
        "username": user.username,
        "reviews": []
    };

    // Search for reviews in updated_movies.json that match the user's username
    updatedMovies.forEach(movie => {
        movie.movie_review.forEach(review => {
            if (review.username === user.username) {
                let reviewData = {
                    "movie_title": movie.movie_title,
                    "movie_countries": movie.movie_countries,
                    "review": review.review,
                    "rate": review.rate,
                    "date_posted": review.date_posted,
                    "status": review.status
                };
                // Add the review data to the user's reviews array
                userData.reviews.push(reviewData);
            }
        });
    });

    // If the user has reviews, add them to the result array
    if (userData.reviews.length > 0) {
        userWithReviews.push(userData);
    }
});

// Save the result to user_with_review.json
const fs = require('fs');
fs.writeFileSync('user_with_review.json', JSON.stringify(userWithReviews, null, 2));

console.log('user_with_review.json created successfully!');
