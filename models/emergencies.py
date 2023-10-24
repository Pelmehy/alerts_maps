from datetime import datetime
from app import db

class Emergencies(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    city_id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=True)
    radius = db.Column(db.Integer, nullable=True)
    impact = db.Column(db.Text, nullable=True)
    emergency_type = db.Column(db.Integer, nullable=False)
    created_on = db.Column(db.DateTime, nullable=False)

    def __int__(self, city_id, title, description, radius, impact, emergency_type):
        self.city_id = city_id
        self.title = title
        self.description = description
        self.radius = radius
        self.impact = impact
        self.emergency_type = emergency_type
        self.created_on = datetime.now()

    @classmethod
    def get(self):
        return self.query.all()

    @classmethod
    def get_by_id(self, id):
        return self.query.filter_by(id=id).first()
