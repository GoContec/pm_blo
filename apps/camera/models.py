# -*- encoding: utf-8 -*-
"""
Cop
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()yright (c) 2019 - present AppSeed.us
"""

from apps import db, login_manager
import requests

from apps.authentication.util import hash_pass

class stationconfig(db.Model):

    __tablename__ = 'stationconfig'

    id = db.Column(db.Integer, primary_key=True)
    warehouse = db.Column(db.String(50))
    station = db.Column(db.String(100))
    configdata = db.Column(db.String)

    def __init__(self, **kwargs):
        for property, value in kwargs.items():
            # depending on whether value is an iterable or not, we must
            # unpack it's value (when **kwargs is request.form, some values
            # will be a 1-element list)

            if hasattr(value, '__iter__') and not isinstance(value, str):
                # the ,= unpack of a singleton fails PEP8 (travis flake8 test)
                value = value[0]


            setattr(self, property, value)

    def __repr__(self):
        return str(self.configdata)


    def user_loader(id):
        stationcon = stationconfig.query.filter_by(id=id).first()
        db.session.remove()
        db.session.close()
        return stationcon


    def request_loader(request):
        station = request.form.get('station')
        stations = stationconfig.query.filter_by(station=station).first()
        return stations if stations else None



