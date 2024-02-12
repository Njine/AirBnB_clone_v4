""" Starts a Flask Web Application """
import uuid
from flask import Flask, render_template
from models import storage
from models.state import State
from models.amenity import Amenity
from models.place import Place

app = Flask(__name__)


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/101-hbnb/', strict_slashes=False)
def hbnb():
    """ HBNB is alive! """
    # Get all states and sort them alphabetically
    states = sorted(storage.all(State).values(), key=lambda s: s.name)
    
    # Get all amenities and sort them alphabetically
    amenities = sorted(storage.all(Amenity).values(), key=lambda a: a.name)
    
    # Get all places and sort them alphabetically
    places = sorted(storage.all(Place).values(), key=lambda p: p.name)
    
    # Group each state with its cities
    state_cities = [(state, sorted(state.cities, key=lambda c: c.name)) for state in states]
    
    # Generate a cache_id
    cache_id = uuid.uuid4()

    return render_template('101-hbnb.html',
                           states=state_cities,
                           amenities=amenities,
                           places=places,
                           cache_id=cache_id)


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)
