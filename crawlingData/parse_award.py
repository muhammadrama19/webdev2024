import mysql.connector
import random

# Connect to your MySQL database
connection = mysql.connector.connect(
    host='localhost',  # Replace with your database host
    user='root',  # Replace with your database username
    password='',  # Replace with your database password
    database='lalajoeuydb'  # Replace with your database name
)

cursor = connection.cursor()

# Function to insert a random award for a movie
def insert_movie_award(movie_id, award_id):
    try:
        query = "INSERT INTO movie_awards (movie_id, awards_id) VALUES (%s, %s)"
        cursor.execute(query, (movie_id, award_id))
        connection.commit()
        print(f"Award ID {award_id} assigned to Movie ID {movie_id} successfully.")
    except mysql.connector.Error as err:
        print(f"Error inserting movie award: {err}")
        connection.rollback()

# Randomly assign awards to movies
for movie_id in range(1, 501):  # Movies from 1 to 500
    # Randomly decide the number of awards for this movie (0 to 5 awards)
    num_awards = random.randint(0, 5)
    for _ in range(num_awards):
        # Randomly select an award ID from 1 to 20
        award_id = random.randint(1, 20)
        insert_movie_award(movie_id, award_id)

# Close the database connection
cursor.close()
connection.close()
