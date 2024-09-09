import aiohttp
import asyncio
import json

API_KEY = '737a957b7dc0dabdcf23cfed802c48bb'
POPULAR_MOVIES_URL = 'https://api.themoviedb.org/3/movie/popular'
BASE_URL = 'https://api.themoviedb.org/3/movie/'

# Country code to full name mapping
COUNTRY_MAPPING = {
    "AF": "Afghanistan",
    "AL": "Albania",
    "DZ": "Algeria",
    "AS": "American Samoa",
    "AD": "Andorra",
    "AO": "Angola",
    "AI": "Anguilla",
    "AQ": "Antarctica",
    "AG": "Antigua and Barbuda",
    "AR": "Argentina",
    "AM": "Armenia",
    "AW": "Aruba",
    "AU": "Australia",
    "AT": "Austria",
    "AZ": "Azerbaijan",
    "BS": "Bahamas",
    "BH": "Bahrain",
    "BD": "Bangladesh",
    "BB": "Barbados",
    "BY": "Belarus",
    "BE": "Belgium",
    "BZ": "Belize",
    "BJ": "Benin",
    "BM": "Bermuda",
    "BT": "Bhutan",
    "BO": "Bolivia",
    "BA": "Bosnia and Herzegovina",
    "BW": "Botswana",
    "BR": "Brazil",
    "IO": "British Indian Ocean Territory",
    "BN": "Brunei Darussalam",
    "BG": "Bulgaria",
    "BF": "Burkina Faso",
    "BI": "Burundi",
    "CV": "Cabo Verde",
    "KH": "Cambodia",
    "CM": "Cameroon",
    "CA": "Canada",
    "KY": "Cayman Islands",
    "CF": "Central African Republic",
    "TD": "Chad",
    "CL": "Chile",
    "CN": "China",
    "CO": "Colombia",
    "KM": "Comoros",
    "CG": "Congo",
    "CD": "Congo, Democratic Republic of the",
    "CK": "Cook Islands",
    "CR": "Costa Rica",
    "HR": "Croatia",
    "CU": "Cuba",
    "CY": "Cyprus",
    "CZ": "Czech Republic",
    "DK": "Denmark",
    "DJ": "Djibouti",
    "DM": "Dominica",
    "DO": "Dominican Republic",
    "EC": "Ecuador",
    "EG": "Egypt",
    "SV": "El Salvador",
    "GQ": "Equatorial Guinea",
    "ER": "Eritrea",
    "EE": "Estonia",
    "SZ": "Eswatini",
    "ET": "Ethiopia",
    "FJ": "Fiji",
    "FI": "Finland",
    "FR": "France",
    "GA": "Gabon",
    "GM": "Gambia",
    "GE": "Georgia",
    "DE": "Germany",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GR": "Greece",
    "GL": "Greenland",
    "GD": "Grenada",
    "GU": "Guam",
    "GT": "Guatemala",
    "GG": "Guernsey",
    "GN": "Guinea",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",
    "HT": "Haiti",
    "HN": "Honduras",
    "HK": "Hong Kong",
    "HU": "Hungary",
    "IS": "Iceland",
    "IN": "India",
    "ID": "Indonesia",
    "IR": "Iran",
    "IQ": "Iraq",
    "IE": "Ireland",
    "IM": "Isle of Man",
    "IL": "Israel",
    "IT": "Italy",
    "JM": "Jamaica",
    "JP": "Japan",
    "JE": "Jersey",
    "JO": "Jordan",
    "KZ": "Kazakhstan",
    "KE": "Kenya",
    "KI": "Kiribati",
    "KP": "Korea, Democratic People's Republic of",
    "KR": "Korea, Republic of",
    "KW": "Kuwait",
    "KG": "Kyrgyzstan",
    "LA": "Lao People's Democratic Republic",
    "LV": "Latvia",
    "LB": "Lebanon",
    "LS": "Lesotho",
    "LR": "Liberia",
    "LY": "Libya",
    "LI": "Liechtenstein",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "MO": "Macao",
    "MG": "Madagascar",
    "MW": "Malawi",
    "MY": "Malaysia",
    "MV": "Maldives",
    "ML": "Mali",
    "MT": "Malta",
    "MH": "Marshall Islands",
    "MR": "Mauritania",
    "MU": "Mauritius",
    "MX": "Mexico",
    "FM": "Micronesia",
    "MD": "Moldova",
    "MC": "Monaco",
    "MN": "Mongolia",
    "ME": "Montenegro",
    "MS": "Montserrat",
    "MA": "Morocco",
    "MZ": "Mozambique",
    "MM": "Myanmar",
    "NA": "Namibia",
    "NR": "Nauru",
    "NP": "Nepal",
    "NL": "Netherlands",
    "NZ": "New Zealand",
    "NI": "Nicaragua",
    "NE": "Niger",
    "NG": "Nigeria",
    "NU": "Niue",
    "NF": "Norfolk Island",
    "MK": "North Macedonia",
    "MP": "Northern Mariana Islands",
    "NO": "Norway",
    "OM": "Oman",
    "PK": "Pakistan",
    "PW": "Palau",
    "PS": "Palestine, State of",
    "PA": "Panama",
    "PG": "Papua New Guinea",
    "PY": "Paraguay",
    "PE": "Peru",
    "PH": "Philippines",
    "PL": "Poland",
    "PT": "Portugal",
    "QA": "Qatar",
    "RO": "Romania",
    "RU": "Russian Federation",
    "RW": "Rwanda",
    "KN": "Saint Kitts and Nevis",
    "LC": "Saint Lucia",
    "VC": "Saint Vincent and the Grenadines",
    "WS": "Samoa",
    "SM": "San Marino",
    "ST": "Sao Tome and Principe",
    "SA": "Saudi Arabia",
    "SN": "Senegal",
    "RS": "Serbia",
    "SC": "Seychelles",
    "SL": "Sierra Leone",
    "SG": "Singapore",
    "SX": "Sint Maarten (Dutch part)",
    "SK": "Slovakia",
    "SI": "Slovenia",
    "SB": "Solomon Islands",
    "SO": "Somalia",
    "ZA": "South Africa",
    "SS": "South Sudan",
    "ES": "Spain",
    "LK": "Sri Lanka",
    "SD": "Sudan",
    "SR": "Suriname",
    "SE": "Sweden",
    "CH": "Switzerland",
    "SY": "Syrian Arab Republic",
    "TW": "Taiwan",
    "TJ": "Tajikistan",
    "TZ": "Tanzania",
    "TH": "Thailand",
    "TL": "Timor-Leste",
    "TG": "Togo",
    "TO": "Tonga",
    "TT": "Trinidad and Tobago",
    "TN": "Tunisia",
    "TR": "Turkey",
    "TM": "Turkmenistan",
    "TV": "Tuvalu",
    "UG": "Uganda",
    "UA": "Ukraine",
    "AE": "United Arab Emirates",
    "GB": "United Kingdom",
    "US": "United States",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",
    "VU": "Vanuatu",
    "VE": "Venezuela",
    "VN": "Viet Nam",
    "YE": "Yemen",
    "ZM": "Zambia",
    "ZW": "Zimbabwe"
}


async def fetch_movie_ids(session, pages=25):
    movie_ids = []
    for page in range(1, pages + 1):
        try:
            url = f"{POPULAR_MOVIES_URL}?api_key={API_KEY}&page={page}"
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    movie_ids.extend([movie['id'] for movie in data['results']])
                else:
                    print(f"Failed to fetch movie IDs on page {page}, status code: {response.status}")
        except Exception as e:
            print(f"Error fetching movie IDs on page {page}: {e}")
        await asyncio.sleep(1)  # Avoid hitting API rate limits
    return movie_ids

async def fetch_movie_details(session, movie_id):
    try:
        movie_url = f"{BASE_URL}{movie_id}?api_key={API_KEY}&append_to_response=credits,images,alternative_titles,releases,reviews,external_ids"
        async with session.get(movie_url) as response:
            if response.status == 200:
                movie_data = await response.json()
                return parse_movie_data(movie_data)
            else:
                print(f"Failed to fetch movie details for {movie_id}, status code: {response.status}")
    except Exception as e:
        print(f"Error fetching movie details for {movie_id}: {e}")
    await asyncio.sleep(1)  # Avoid hitting API rate limits
    return None

def parse_movie_data(movie_data):
    movie_id = movie_data.get('id')
    movie_name = movie_data.get('title')
    synopsis = movie_data.get('overview')

    # Genres
    genres = [g['name'].lower() for g in movie_data.get('genres', [])]

    # Country of production (use production_countries instead of release countries)
    countries = movie_data.get('production_countries', [])
    movie_countries = [COUNTRY_MAPPING.get(country['iso_3166_1'], "Unknown") for country in countries]
    movie_countries = ", ".join(movie_countries)  # Join multiple countries if needed

    # Alternative titles, limit to 3
    alt_titles = []
    seen_countries = set()
    for title in movie_data.get('alternative_titles', {}).get('titles', [])[:5]:
        country_code = title['iso_3166_1']
        if country_code not in seen_countries:
            alt_titles.append({
                "country_name": COUNTRY_MAPPING.get(country_code, "Unknown"),
                "title": title['title']
            })
            seen_countries.add(country_code)

    # Actors and roles, limit to 5
    movie_actors = []
    if 'credits' in movie_data:
        for actor in movie_data['credits'].get('cast', [])[:10]:
            movie_actors.append({
                "actor_profile_pic": f"https://image.tmdb.org/t/p/w500{actor['profile_path']}" if actor['profile_path'] else "N/A",
                "actor_name": actor['name'],
                "role_name": actor['character']
            })

    # Director
    director = None
    for crew_member in movie_data['credits'].get('crew', []):
        if crew_member['job'].lower() == 'director':
            director = crew_member['name']
            break

    # IMDb score
    imdb_score = movie_data.get('vote_average')

    # Awards
    awards = "N/A"

    # Poster and background images
    movie_poster = f"https://image.tmdb.org/t/p/w500{movie_data.get('poster_path')}" if movie_data.get('poster_path') else "N/A"
    movie_background = f"https://image.tmdb.org/t/p/w1280{movie_data.get('backdrop_path')}" if movie_data.get('backdrop_path') else "N/A"

    # Reviews, limit to 5
    reviews = []
    for review in movie_data.get('reviews', {}).get('results', [])[:5]:
        review_author = review.get('author_details', {}).get('username')
        review_content = review.get('content')
        review_date = review.get('created_at')
        review_rating = review.get('author_details', {}).get('rating', "N/A")
        review_profile_image = review.get('author_details', {}).get('avatar_path')

        if review_profile_image:
            if review_profile_image.startswith("/http"):
                review_profile_image = review_profile_image[1:]
            else:
                review_profile_image = f"https://image.tmdb.org/t/p/w500{review_profile_image}"

        reviews.append({
            "user_profile_pic": review_profile_image,
            "username": review_author,
            "review": review_content,
            "rate": review_rating,
            "date_posted": review_date,
            "status": "true"
        })

    return {
        "movie_title": movie_name,
        "movie_countries": movie_countries,  # List of production countries
        "movie_title_other_countries": alt_titles,
        "movie_synopsis": synopsis,
        "movie_genre": genres,
        "movie_actor": movie_actors,  # Limited to 5 actors
        "movie_director": director,
        "movie_imdbscore": imdb_score,
        "movie_awards": awards,
        "movie_poster": movie_poster,
        "movie_background": movie_background,
        "movie_review": reviews  # Limited to 5 reviews
    }

async def save_json(data, filename):
    with open(filename, 'w') as json_file:
        json.dump(data, json_file, indent=4)

async def main():
    async with aiohttp.ClientSession() as session:
        movie_ids = await fetch_movie_ids(session, pages=25)
        tasks = [fetch_movie_details(session, movie_id) for movie_id in movie_ids]
        movie_data = await asyncio.gather(*tasks)
        movie_data = [movie for movie in movie_data if movie is not None]
        await save_json(movie_data, 'movies.json')

if __name__ == "__main__":
    asyncio.run(main())
