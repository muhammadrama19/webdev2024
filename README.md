
# Movie Review App Project
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&style=for-the-badge)  
&nbsp;&nbsp;&nbsp;
![React Router](https://img.shields.io/badge/React%20Router-CA4245?logo=react-router&logoColor=white&style=for-the-badge)  
&nbsp;&nbsp;&nbsp;
![Sass](https://img.shields.io/badge/Sass-CC6699?logo=sass&logoColor=white&style=for-the-badge)  
&nbsp;&nbsp;&nbsp;
![React-Bootstrap](https://img.shields.io/badge/React%20Bootstrap-563D7C?logo=bootstrap&logoColor=white&style=for-the-badge)  
&nbsp;&nbsp;&nbsp;
![Material UI](https://img.shields.io/badge/Material%20UI-0081CB?logo=mui&logoColor=white&style=for-the-badge)  
&nbsp;&nbsp;&nbsp;
![Google OAuth](https://img.shields.io/badge/Google%20OAuth-4285F4?logo=google&logoColor=white&style=for-the-badge)  
&nbsp;&nbsp;&nbsp;
![JWT](https://img.shields.io/badge/JWT-black?logo=jsonwebtokens&logoColor=white&style=for-the-badge)  
&nbsp;&nbsp;&nbsp;
![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?logo=passport&logoColor=white&style=for-the-badge)  
&nbsp;&nbsp;&nbsp;
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white&style=for-the-badge)  
&nbsp;&nbsp;&nbsp;
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white&style=for-the-badge)


## Project Description

This project is a web application for movie review app. It comes with client app where user can view movie and its detail also Content Management System (CMS) for managing its content and user. 

This project built for Web Development Course at JTK POLBAN.


## Key Features

### Client-Side Features
1. **Home Page**  
   The main landing page for users, providing access to movie information.
2. **User Authentication**  
   - **Register**: Allows new users to create an account.  
   - **Login**: Enables existing users to log in.  
   - **Forgot Password**: Provides a method for users to reset forgotten passwords.  
   - **Reset Password**: Enables users to reset their password using a token.  
3. **Movie Details**  
   - **Detail Movie Page**: Displays detailed information about specific movies, including reviews, actor information, and trailers.  
     - **Movie Trailer**  
     - **User Reviews**  
     - **Actor Information**: Includes details about actors and their roles in the movie.  
4. **Review Bar**  
   Users can add reviews and ratings for movies.

### Admin-Side Features
1. **Dashboard**  
   Provides an overview of platform statistics and activities.
2. **Movie Management**  
   - **Input Drama**: Allows admins to add new movies.  
   - **List Drama**: Displays a list of all movies.  
   - **Validate Drama**: Enables validation and approval of movies.  
   - **Validate History**: Displays the history of validated movies.  
   - **Movie Trash**: Manages movies that have been moved to the trash.  
3. **Review Management**  
   Admins can manage user reviews.
4. **Actor Management**  
   Admins can manage actors and their roles in movies.
5. **Genre Management**  
   Admins can manage movie genres.
6. **Country Management**  
   Admins can manage country-related movie data.
7. **Awards Management**  
   Admins can manage movie awards.
8. **User Settings**  
   Allows admins to manage user settings and permissions.

---

## Installation Guide

### Prerequisites
- Node.js
- MySQL database

### Cloning the Repository
1. Open a terminal (bash) and clone the repository:
   ```bash
   git clone https://github.com/muhammadrama19/webdev2024.git
   ```
2. Navigate to the project directory:
   ```bash
   cd webdev2024
   ```

### Importing the Database
3. Import the database from the repo into your MySQL instance using the appropriate `.sql` file. The database is located in repository on folder database.

### Install Dependencies
4. Navigate to the project directory and install dependencies. Both for server and view:
   Open new terminal on folder 'server', then type
   ```bash
   npm install
   ```
   Open new terminal on folder 'view', then type
   ```bash
   npm install
   ```

### Configure Environment Variables
5. Create a `.env` file in the root of your project and configure it with the following variables:
   ```env
   JWT_SECRET=
   EMAIL=
   EMAIL_PASSWORD=
   CREDENTIALS_SENDER_NAME=
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   SESSION_SECRET=
   ```

### Running the Application  
5. Start your sql database server  
6. Start the backend server on 'server':
   ```bash
   node index.js
   ```
7. Open new terminal start the frontend application on folder 'view':
   ```bash
   npm start
   ```

---

## Author
Akmal Goniyyu Hartono 	(221524002)  
M. Azharuddin Hamid 	(221524018)  
M. Rama Nurimani 		(221524021)


---

## Acknowledgements

 - [TMDB API for data source](https://developer.themoviedb.org/reference/intro/getting-started)







``` bash
docker cp database/lalajoeuydb.sql container_mysql:/tmp/lalajoeuydb.sql

mysql -u root -proot lalajoeuydb < /tmp/lalajoeuydb.sql

```
USE lalajoeuydb;
SHOW TABLES;
SELECT * FROM genres;
```