const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');

// Path to the input and output files
const inputFilePath = path.join(__dirname, 'movies.json');
const outputFilePath = path.join(__dirname, 'user.json');

// Function to generate a random integer
const getRandomInt = (max) => Math.floor(Math.random() * max);

// Function to hash the password
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// Function to create user data from movie reviews
const createUserData = async () => {
    try {
        // Read movies.json
        const data = fs.readFileSync(inputFilePath, 'utf8');
        const movies = JSON.parse(data);

        // Collect user data from movie reviews
        const users = [];
        for (const movie of movies) {
            for (const review of movie.movie_review || []) {
                const username = review.username;
                if (username) {
                    const email = `${username}@gmail.com`;
                    const password = `${username}1234`;
                    const hashedPassword = await hashPassword(password);
                    const userProfilePic = review.user_profile_pic; // Get the user_profile_pic field
                    users.push({
                        username,
                        email,
                        password: hashedPassword,
                        role: 'User',
                        user_profile_pic: userProfilePic // Append user_profile_pic to the user data
                    });
                }
            }
        }

        // Write user.json
        fs.writeFileSync(outputFilePath, JSON.stringify(users, null, 4));
        console.log('user.json has been created successfully.');
    } catch (error) {
        console.error('Error creating user.json:', error);
    }
};

// Run the function
createUserData();
