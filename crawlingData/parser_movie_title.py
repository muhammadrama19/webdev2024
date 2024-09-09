import mysql.connector
from mysql.connector import Error
import json

# Database connection
def create_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='lalajoeuydb',
            user='root',
            password=''
        )
        return connection
    except Error as e:
        print(f"Error: {e}")
        return None

# Insert countries and movie alternate titles into the database
def insert_alt_titles(movie_data, cursor):
    try:
        # 1. Find the movie_id based on the title
        cursor.execute("SELECT id FROM movies WHERE title = %s", (movie_data["movie_title"],))
        movie_result = cursor.fetchone()

        if movie_result:
            movie_id = movie_result[0]
        else:
            print(f"Movie '{movie_data['movie_title']}' not found in 'movies' table.")
            return

        # 2. Insert countries and movie_alt_titles
        for alt_title in movie_data["movie_title_other_countries"]:
            country_name = alt_title["country_name"]
            alt_movie_title = alt_title["title"]

            # Check if the country exists
            cursor.execute("SELECT country_id FROM country WHERE country_name = %s", (country_name,))
            country_result = cursor.fetchone()

            if country_result:
                country_id = country_result[0]
            else:
                # Insert new country
                insert_country_query = "INSERT INTO country (country_name) VALUES (%s)"
                cursor.execute(insert_country_query, (country_name,))
                country_id = cursor.lastrowid  # Get the ID of the newly inserted country

            # Insert into movie_alt_titles
            insert_alt_title_query = """
            INSERT INTO movie_alt_titles (movie_id, country_id, title)
            VALUES (%s, %s, %s)
            """
            cursor.execute(insert_alt_title_query, (movie_id, country_id, alt_movie_title))

        print(f"Alternate titles for movie '{movie_data['movie_title']}' inserted successfully.")

    except Error as e:
        print(f"Error: {e}")

# Main function to read movies.json and insert alternate titles
def main():
    connection = create_connection()
    if connection:
        cursor = connection.cursor()

        try:
            # Read the JSON file
            with open('movies.json', 'r', encoding='utf-8') as f:
                movies = json.load(f)

            # Insert alternate titles for each movie
            for movie in movies:
                insert_alt_titles(movie, cursor)

            connection.commit()  # Commit the transaction

        except Error as e:
            print(f"Error: {e}")
            connection.rollback()  # Rollback in case of an error

        finally:
            cursor.close()
            connection.close()

if __name__ == "__main__":
    main()
