const fs = require('fs');
const path = require('path');

// Path to the input and output files
const inputFilePath = path.join(__dirname, 'user.json');
const outputFilePath = path.join(__dirname, 'user_reduced.json');

// Function to reduce user data to 200 unique entries
const reduceUserData = () => {
    try {
        // Read the existing user.json
        const data = fs.readFileSync(inputFilePath, 'utf8');
        const users = JSON.parse(data);

        // Use a Set to ensure unique users based on username
        const uniqueUsers = new Map();
        users.forEach(user => {
            if (!uniqueUsers.has(user.username)) {
                uniqueUsers.set(user.username, user);
            }
        });

        // Convert Map values to array and limit to 200 entries
        const reducedUsers = Array.from(uniqueUsers.values()).slice(0, 200);

        // Write the reduced user.json
        fs.writeFileSync(outputFilePath, JSON.stringify(reducedUsers, null, 4));
        console.log('user_reduced.json has been created successfully with up to 200 unique users.');
    } catch (error) {
        console.error('Error reducing user data:', error);
    }
};

// Run the function
reduceUserData();
