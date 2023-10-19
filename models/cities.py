import json
from datetime import datetime

from app import db


class Cities(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    ua_name = db.Column(db.String(100))
    created_on = db.Column(db.DateTime, nullable=False)

    def __int__(self, name, ua_name):
        self.name = name
        self.created_on = datetime.now()
        self.ua_name = ua_name

    @classmethod
    def get(self):
        return self.query.all()

    @classmethod
    def get_by_id(self, id):
        return self.query.filter_by(id=id).first()

    @classmethod
    def get_by_name(self, name):
        return self.query.filter_by(name=name).first()