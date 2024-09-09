import json
import mysql.connector

# Connect to your MySQL database
connection = mysql.connector.connect(
    host='localhost',  # Replace with your database host
    user='root',  # Replace with your database username
    password='',  # Replace with your database password
    database='lalajoeuydb'  # Replace with your database name
)

cursor = connection.cursor()

# Read the match_within_userid.json file
try:
    with open('match_within_userid.json', 'r', encoding='utf-8') as file:
        users_data = json.load(file)  # Parse JSON data
except json.JSONDecodeError as e:
    print(f"Error parsing JSON: {e}")
    exit()
except UnicodeDecodeError as e:
    print(f"Encoding error: {e}")
    exit()
except Exception as e:
    print(f"An error occurred: {e}")
    exit()

# Function to insert review data into the 'reviews' table
def insert_review(user_id, movie_id, review_content, rating, status):
    try:
        # Insert review data into the reviews table
        query = """
            INSERT INTO reviews (movie_id, user_id, content, rating, status, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
        """
        cursor.execute(query, (movie_id, user_id, review_content, rating, status))
        connection.commit()
        print(f"Review for movie ID {movie_id} inserted successfully for user ID {user_id}.")
    except mysql.connector.Error as err:
        print(f"Error inserting review into database: {err}")
        connection.rollback()

# Process each user's review(s)
if isinstance(users_data, list):
    for user_data in users_data:
        user_id = user_data.get('user_id')
        username = user_data.get('username')

        if user_id and username:
            # Verify user_id integrity by checking if the user_id exists in the 'users' table
            query = "SELECT id FROM users WHERE id = %s AND username = %s"
            cursor.execute(query, (user_id, username))
            result = cursor.fetchone()

            if result:
                print(f"Verified user: {username} with user ID: {user_id}")
                
                # Loop through each review for the user
                for review in user_data['reviews']:
                    movie_id = review.get('movie_id')
                    review_content = review.get('review')
                    rating = review.get('rate')
                    status = int(review.get('status') == "true")  # Convert status to tinyint (1 or 0)

                    # Insert review into the reviews table
                    insert_review(user_id, movie_id, review_content, rating, status)
            else:
                print(f"Integrity check failed: No matching user for user ID {user_id} and username {username}")
else:
    print("Error: The JSON data is not in a valid list format.")

# Close the database connection
cursor.close()
connection.close()
