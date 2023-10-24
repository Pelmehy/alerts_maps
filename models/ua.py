from app import db


class UA(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    city = db.Column(db.Text, nullable=True)
    lat = db.Column(db.Double, nullable=True)
    lng = db.Column(db.Double, nullable=True)
    country = db.Column(db.Text, nullable=True)
    iso2 = db.Column(db.String(2), nullable=True)
    admin_name = db.Column(db.Text, nullable=True)
    ua_name = db.Column(db.Text, nullable=True)
    capital = db.Column(db.Text, nullable=True)
    population = db.Column(db.Integer, nullable=True)
    population_proper = db.Column(db.Integer, nullable=True)

    @classmethod
    def get(self):
        return self.query.all()

    @classmethod
    def get_by_id(self):
        return self.query.filter_by(id=id).first()
