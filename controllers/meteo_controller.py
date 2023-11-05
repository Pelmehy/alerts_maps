import requests

from app import db

from app import Config
from app import UA


class Meteo_controller():
    meteo_url = Config.open_meteo_url

    @classmethod
    def get_by_city(cls, city_name: str):
        city = UA.get_by_name(city_name)

        return cls.get_meteo(city.lat, city.lng).json()

    @classmethod
    def get_meteo(cls, lat, lng):
        fetch_url = cls.meteo_url \
                    + 'forecast?latitude=' + str(lat) \
                    + '&longitude=' + str(lng) \
                    + '&hourly=temperature_2m,rain,snowfall,windspeed_180m,winddirection_180m&forecast_days=1'
        response = requests.get(fetch_url)

        return response