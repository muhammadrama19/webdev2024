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

# Insert movie and related data into the database
def insert_movie_data(movie_data, cursor):
    try:
        # 1. Insert movie into 'movies' table
        insert_movie_query = """
        INSERT INTO movies (title, country_release, imdb_score, synopsis, poster, background, director)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        movie_values = (
            movie_data["movie_title"],
            movie_data["movie_countries"],
            movie_data["movie_imdbscore"],
            movie_data["movie_synopsis"],
            movie_data["movie_poster"],
            movie_data["movie_background"],
            movie_data["movie_director"]
        )
        cursor.execute(insert_movie_query, movie_values)
        movie_id = cursor.lastrowid  # Get the ID of the newly inserted movie

        # 2. Insert genres into 'genres' and associate with movie in 'movie_genres'
        for genre in movie_data["movie_genre"]:
            cursor.execute("SELECT id FROM genres WHERE name = %s", (genre,))
            genre_result = cursor.fetchone()

            if genre_result:
                genre_id = genre_result[0]
            else:
                insert_genre_query = "INSERT INTO genres (name) VALUES (%s)"
                cursor.execute(insert_genre_query, (genre,))
                genre_id = cursor.lastrowid  # Get the ID of the newly inserted genre

            insert_movie_genre_query = "INSERT INTO movie_genres (movie_id, genre_id) VALUES (%s, %s)"
            cursor.execute(insert_movie_genre_query, (movie_id, genre_id))

        # 3. Insert actors and their roles into 'actors' and 'movie_actors'
        for actor_data in movie_data["movie_actor"]:
            actor_name = actor_data["actor_name"]
            role_name = actor_data["role_name"]
            actor_picture = actor_data["actor_profile_pic"]  # Get actor profile picture

            # Check if actor exists
            cursor.execute("SELECT id FROM actors WHERE name = %s", (actor_name,))
            actor_result = cursor.fetchone()

            if actor_result:
                actor_id = actor_result[0]
            else:
                insert_actor_query = "INSERT INTO actors (name, actor_picture) VALUES (%s, %s)"
                cursor.execute(insert_actor_query, (actor_name, actor_picture))
                actor_id = cursor.lastrowid  # Get the ID of the newly inserted actor

            # Insert into 'movie_actors'
            insert_movie_actor_query = "INSERT INTO movie_actors (movie_id, actor_id, role) VALUES (%s, %s, %s)"
            cursor.execute(insert_movie_actor_query, (movie_id, actor_id, role_name))
        
        for movie_title in movie_data["movie_title_other_countries"]:
            country_name = movie_title["country_name"]
            alt_movie_title = movie_title["title"]
            cursor.execute("SELECT id FROM country WHERE country_name = %s", (country_name,))
            country_result = cursor.fetchone()
            if country_result:
                country_id = country_result[0]
            else:
                insert_country_query = "INSERT INTO country (country_name) VALUES (%s)"
                cursor.execute(insert_country_query, (country_name,))
                country_id = cursor.lastrowid
            insert_alt_title_query = "INSERT INTO movie_alt_titles (movie_id, country_id, title) VALUES (%s, %s, %s)"
            cursor.execute(insert_alt_title_query, (movie_id, country_id, alt_movie_title))
        print(f"Movie '{movie_data['movie_title']}' and its related data inserted successfully.")

        

    except Error as e:
        print(f"Error: {e}")

# Main function to read movies.json and insert data
def main():
    connection = create_connection()
    if connection:
        cursor = connection.cursor()

        try:
            # Read the JSON file
            with open('movies.json', 'r', encoding='utf-8') as f:
                movies = json.load(f)

            # Insert each movie into the database
            for movie in movies:
                insert_movie_data(movie, cursor)

            connection.commit()  # Commit the transaction

        except Error as e:
            print(f"Error: {e}")
            connection.rollback()  # Rollback in case of an error

        finally:
            cursor.close()
            connection.close()

if __name__ == "__main__":
    main()
