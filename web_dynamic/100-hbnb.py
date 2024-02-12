#!/usr/bin/python3
"""
Flask App that integrates with AirBnB static HTML Template
"""
import uuid
from flask import Flask, render_template
from models import storage

# Flask setup
app = Flask(__name__)
app.url_map.strict_slashes = False
port = 5000
host = '0.0.0.0'


# Teardown handler for closing the database session
@app.teardown_appcontext
def teardown_db(exception):
    """Close the SQLAlchemy session after each request."""
    storage.close()


# Route to render the custom HTML template with states, amenities, places, and users
@app.route('/100-hbnb/')
def hbnb_filters():
    """Handle request to custom template with states, cities & amenities."""
    states = storage.all('State').values()
    amens = storage.all('Amenity').values()
    places = storage.all('Place').values()
    users = {user.id: f"{user.first_name} {user.last_name}" for user in storage.all('User').values()}
    cache_id = str(uuid.uuid4())
    return render_template('100-hbnb.html',
                           states=states,
                           amens=amens,
                           places=places,
                           users=users,
                           cache_id=cache_id)


# Main function to run the Flask application
if __name__ == "__main__":
    app.run(host=host, port=port)
