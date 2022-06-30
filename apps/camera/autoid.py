# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""


from apps import db, login_manager

from apps.authentication.util import hash_pass

class autoid(db.Model):

    __tablename__ = 'autoid'

    id = db.Column(db.Integer, primary_key=True)
    optionfor = db.Column(db.String(50))
    value = db.Column(db.String(50))

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
        return str(self.id)


    def autoid_loader(self, id):
        auditid = autoid.query.filter_by(id=id).first()
        db.session.remove()
        db.session.close()
        return auditid


    def request_loader(self):
        stations = autoid.query.filter_by(optionfor='deepbludirectshipment').first()
        return stations if stations else None
