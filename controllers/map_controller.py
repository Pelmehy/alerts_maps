from app import Events
from app import Regions

def get_events():
    cities = Regions.get()

    for city in cities:
        city.events = Events.get_by_city_id(city.id)

    return cities

