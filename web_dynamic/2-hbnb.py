#!/usr/bin/python3
"""Flask App that integrates with AirBnB static HTML Template For the hbnb02"""
from flask import Flask, render_template, url_for
from models import storage
import uuid;

app = Flask(__name__)
app.url_map.strict_slashes = False


@app.teardown_appcontext
def teardown_db(exception):
    """
    after each request, this method calls .close() (i.e. .remove()) on
    the current SQLAlchemy Session
    """
    storage.close()


@app.route('/2-hbnb')
def hbnb_filters(the_id=None):
    """02-hbnb is alive """
    stater = storage.all('State').values()
    states = dict([state.name, state] for state in stater)
    amin = storage.all('Amenity').values()
    places = storage.all('Place').values()
    users = dict([user.id, "{} {}".format(user.first_name, user.last_name)]
                 for user in storage.all('User').values())
    return render_template('2-hbnb.html',
                           cache_id=uuid.uuid4(),
                           states=states,
                           amin=amin,
                           places=places,
                           users=users)

if __name__ == "__main__":
    """MAIN Fun"""
    app.run(host='0.0.0.0', port=5000)
