from datetime import datetime

from app import db


class Events(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    description = db.Column(db.String(1000))
    city_id = db.Column(db.Integer)
    created_on = db.Column(db.DateTime, nullable=False)

    def __int__(self, title, description, city_id):
        created_on = datetime.now()

        self.title = title
        self.description = description
        self.city_id = city_id
        self.created_on = created_on

    @classmethod
    def get_by_id(self, id):
        return self.query.filter_by(id=id).first()

    @classmethod
    def get_by_city_id(self, city_id):
        return self.query.filter_by(city_id=city_id).all()