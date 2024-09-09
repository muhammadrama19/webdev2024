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

# Read the user_review_complete.json file
try:
    # Open the file with utf-8 encoding
    with open('user_review_complete.json', 'r', encoding='utf-8') as file:
        user_data = json.load(file)  # Parse JSON data as a dictionary
except json.JSONDecodeError as e:
    print(f"Error parsing JSON: {e}")
    exit()
except UnicodeDecodeError as e:
    print(f"Encoding error: {e}")
    exit()
except Exception as e:
    print(f"An error occurred: {e}")
    exit()

# Extract the username from the JSON data
username = user_data.get('username')

if username:
    # Find the corresponding user_id from the 'users' table based on username
    query = "SELECT id FROM users WHERE username = %s"
    cursor.execute(query, (username))
    result = cursor.fetchone()

    # If a matching user is found, update the JSON with user_id
    if result:
        user_id = result[0]
        # Add the 'user_id' key above the 'username' in the JSON structure
        user_data = {"user_id": user_id, **user_data}

        # Save the updated JSON to a new file match_within_userid.json
        with open('match_within_userid.json', 'w', encoding='utf-8') as output_file:
            json.dump(user_data, output_file, indent=4, ensure_ascii=False)

        print(f"User ID {user_id} matched and added to JSON file.")
    else:
        print(f"No matching user found for username: {username}")
else:
    print("Username not found in JSON data.")

# Close the database connection
cursor.close()
connection.close()
