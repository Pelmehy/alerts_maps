from app import Events
from app import Cities

def get_events():
    cities = Cities.get()

    for city in cities:
        city.events = Events.get_by_city_id(city.id)

    return cities

