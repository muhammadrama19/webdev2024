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
        users_data = json.load(file)  # Parse JSON data as a list or dict
except json.JSONDecodeError as e:
    print(f"Error parsing JSON: {e}")
    exit()
except UnicodeDecodeError as e:
    print(f"Encoding error: {e}")
    exit()
except Exception as e:
    print(f"An error occurred: {e}")
    exit()

# Check if the data is a list of users
if isinstance(users_data, list):
    # Iterate over each user in the list
    for user_data in users_data:
        # Extract the username from the JSON data
        username = user_data.get('username')

        # Check if username exists and is valid
        if username:
            print(f"Processing user: {username}")

            # Find the corresponding user_id from the 'users' table based on username
            query = "SELECT id FROM users WHERE username = %s"
            try:
                # Execute the query
                cursor.execute(query, (username,))
                result = cursor.fetchone()

                # If a matching user is found, update the JSON with user_id
                if result:
                    user_id = result[0]
                    # Add the 'user_id' key to the user_data dict
                    user_data['user_id'] = user_id
                    print(f"User ID {user_id} matched and added for username: {username}")
                else:
                    print(f"No matching user found for username: {username}")

            except mysql.connector.Error as err:
                print(f"Error querying the database: {err}")
        else:
            print("Username not found or is invalid in JSON data.")

    # Save the updated JSON to a new file
    with open('match_within_userid.json', 'w', encoding='utf-8') as output_file:
        json.dump(users_data, output_file, indent=4, ensure_ascii=False)

    print("Updated JSON file saved successfully.")

else:
    print("Error: The JSON data is not in a valid list format.")

# Close the database connection
cursor.close()
connection.close()
