import json
import mysql.connector
from mysql.connector import Error

# Database connection configuration
db_config = {
    'host': 'localhost',
    'database': 'lalajoeuydb',
    'user': 'root',
    'password': ''
}

# Valid roles as defined in the MySQL table
VALID_ROLES = ['User', 'Guest', 'Admin']

def validate_and_insert_users(users_data):
    try:
        connection = mysql.connector.connect(**db_config)
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Prepare the SQL query
            query = """
            INSERT INTO users (username, email, password, profile_picture, role)
            VALUES (%s, %s, %s, %s, %s)
            """
            
            # Create a list of tuples for batch insert, validating roles
            values = []
            for user in users_data:
                if user['role'] not in VALID_ROLES:
                    print(f"Warning: Invalid role '{user['role']}' for user '{user['username']}'. Skipping this user.")
                    continue
                values.append((user['username'], user['email'], user['password'], 
                               user.get('user_profile_pic'), user['role']))
            
            # Execute the query
            cursor.executemany(query, values)
            
            # Commit the changes
            connection.commit()
            
            print(f"{cursor.rowcount} users inserted successfully")

    except Error as e:
        print(f"Error: {e}")

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")

def load_json_file(filename):
    try:
        with open(filename, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: File '{filename}' not found.")
        return None
    except json.JSONDecodeError:
        print(f"Error: '{filename}' contains invalid JSON.")
        return None

# Main execution
if __name__ == "__main__":
    users_data = load_json_file('user_reduced.json')
    if users_data:
        validate_and_insert_users(users_data)
    else:
        print("Failed to load user data. Please check the file and try again.")