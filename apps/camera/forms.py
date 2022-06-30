# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from flask_wtf import FlaskForm
from wtforms import TextField, PasswordField
from wtforms.validators import  DataRequired

# Station Registration


class StationForm(FlaskForm):
    station_name = TextField('Station',
                         id='station_name',
                         validators=[DataRequired()])
    operator_area = TextField('Operator Area',
                             id='operator_area',
                             validators=[DataRequired()])

    operator_area = TextField('Operator Area',
                              id='operator_area',
                              validators=[DataRequired()])


