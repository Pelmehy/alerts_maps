from app import bcrypt
from app import Admins


class Auth:
    is_valid = False
    email = None
    password = None

    def __init__(self, email, password):
        user = self.get_admin(email=email)
        if user:
            self.is_valid = self.check_password(password=password, hash=user.password)
        else:
            self.is_valid = False

        if self.is_valid:
            self.user = user
        else:
            self.user = None

    def check_password(self, password, hash):
        return bcrypt.check_password_hash(hash, password)

    def get_admin(self, email):
        return Admins().get_by_email(email=email)
