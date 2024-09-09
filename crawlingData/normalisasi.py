import json
import math

# Function to convert rating from 1-10 scale to 1-5 scale
def convert_rating(rating):
    return math.ceil(rating / 2)

# Function to update ratings in movie reviews
def update_ratings(data):
    for review in data.get("movie_review", []):
        review["rate"] = convert_rating(review["rate"])

# Read JSON data from the file
def read_json_file(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

# Write JSON data to the file
def write_json_file(file_path, data):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)

# Main function to process the JSON file
def process_movie_ratings(input_file, output_file):
    # Load the data
    data = read_json_file(input_file)
    
    # Update the ratings
    update_ratings(data)
    
    # Save the updated data
    write_json_file(output_file, data)

# File paths
input_file = 'movies.json'
output_file = 'updated_movies.json'

# Process the movie ratings
process_movie_ratings(input_file, output_file)
