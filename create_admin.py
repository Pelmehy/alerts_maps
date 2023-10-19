import click
from flask import Flask
from models.admins import Admins
from app import db

app = Flask(__name__)

@app.cli.command("create-admin")
@click.argument("email")
@click.argument("password")
def create_admin(email, password):
    admin = Admins(email=email, password=password)

    db.session.add(admin)
    db.session.commit()
