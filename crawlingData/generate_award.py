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

# Create a list of random award names
award_names = [
    'Best Director',
    'Best Actor',
    'Best Actress',
    'Best Cinematography',
    'Best Visual Effects',
    'Best Sound Editing',
    'Best Original Screenplay',
    'Best Costume Design',
    'Best Supporting Actor',
    'Best Supporting Actress',
    'Best Original Song',
    'Best Film Editing',
    'Best Makeup & Hairstyling',
    'Best Production Design',
    'Best Animated Feature',
    'Best Documentary Feature',
    'Best Foreign Language Film',
    'Best Short Film',
    'Best Ensemble Cast',
    'Best Debut Director'
]

# Function to insert awards into the database
def insert_award(award_name):
    try:
        query = "INSERT INTO awards (awards_name) VALUES (%s)"
        cursor.execute(query, (award_name,))
        connection.commit()
        print(f"Award '{award_name}' inserted successfully.")
    except mysql.connector.Error as err:
        print(f"Error inserting award: {err}")
        connection.rollback()

# Insert each award into the awards table
for award in award_names:
    insert_award(award)

# Close the database connection
cursor.close()
connection.close()
