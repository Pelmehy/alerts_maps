from flask import *
from datetime import timedelta, datetime
from flask_sqlalchemy import SQLAlchemy
import click

from flask_bcrypt import Bcrypt
from flask_migrate import Migrate

from config import Config

app = Flask(__name__)
app.secret_key = 'secret'
app.config['SQLALCHEMY_DATABASE_URI'] = Config.db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.permanent_session_lifetime = timedelta(minutes=60)

db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)

from models.regions import Regions
from models.admins import Admins
from models.events import Events
from models.auth_model import Auth
from models.ua import UA
from models.emergencies import Emergencies
from models.emergency_types import Emergency_types

from controllers.map_controller import get_events

if __name__ == '__main__':
    # db.create_all()
    app.run()


@app.route('/')
def admin():
    check_session()

    cities = get_events()


    return render_template(
        'admin/adminLTE.html',
        isAdmin=session['is_admin'],
        cities=cities,
        ua_cities=UA.get(),
        emergencies=Emergencies.get(),
        emergency_types=Emergency_types.get()
    )

@app.route('/admin', methods=['POST', 'GET'])
def admin_page():
    check_session()
    error = ''

    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        auth_user = Auth(email, password)
        if auth_user.is_valid:
            session['is_admin'] = True
            session['email'] = auth_user.user.email
        else:
            error = 'Пароль або пошта не співпадають'

    if session['is_admin']:
        return redirect('/')
    else:
        return render_template('admin/login.html', error=error)


@app.route('/add_event', methods=['POST'])
def add_event():
    check_session()
    if not session['is_admin']:
        return redirect('/')

    city_id = request.form['city']
    # app.logger.warning(city_id)
    city = UA.get_by_id(city_id)

    emergency = Emergencies(
        city_id=city.id,
        title=request.form['title'],
        description=request.form['description'],
        radius=request.form['radius'],
        emergency_type=request.form['emergency_type']
    )

    emergency.created_on = datetime.now()

    db.session.add(emergency)
    db.session.commit()


    return redirect('/')


@app.route('/delete_event/<int:emergency_id>')
def delete_event(emergency_id):
    check_session()

    error = ''
    if not session['is_admin']:
        return redirect('/')

    emergency = Emergencies.get_by_id(emergency_id)
    if emergency:
        db.session.delete(emergency)
        db.session.commit()
    else:
        error = 'Event was not found'

    return redirect('/')


def check_session():
    if 'is_admin' not in session:
        session['is_admin'] = False


@app.cli.command("create-admin")
@click.argument("email")
@click.argument("password")
def create_admin(email, password):
    admin = Admins(email=email, password=password)

    db.session.add(admin)
    db.session.commit()