from datetime import datetime

from app import bcrypt, db


class Admins(db.Model):

    __tablename__ = "admins"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    created_on = db.Column(db.DateTime, nullable=False)

    def __init__(self, email='a', password='a'):
        self.email = email
        self.password = bcrypt.generate_password_hash(password)
        self.created_on = datetime.now()

    def __repr__(self):
        return f"<email {self.email}>"

    def get_by_email(self, email):
        return self.query.filter_by(email=email).first()
