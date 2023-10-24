from app import db

class Emergency_types(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    possible_effects = db.Column(db.Text, nullable=True)

    def __int__(self, name, possible_effects):
        self.name = name
        self.possible_effects = possible_effects

    @classmethod
    def get_by_id(self, id):
        return self.query.filter_by(id=id).first()

    @classmethod
    def get_by_name(self, name):
        return self.query.filter_by(name=name).first()