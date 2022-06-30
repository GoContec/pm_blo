# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from apps.home import blueprint
from flask import render_template, request, Response,session

from flask_login import login_required
from jinja2 import TemplateNotFound
from apps.camera.forms import StationForm
from translate import Translator
from datetime import datetime
import os
from apps.report.models import motions

import pytz
other_tz = pytz.timezone('US/Eastern')

def get_correct_path(relative_path):
    p = os.path.abspath(".").replace('/dist', "")
    return os.path.join(p, relative_path)

YEAR        = datetime.now().astimezone(other_tz).year
MONTH       = datetime.now().astimezone(other_tz).month
DATE        = datetime.now().astimezone(other_tz).day
DATEDAY        = datetime.now().astimezone(other_tz).date
HOUR        = datetime.now().astimezone(other_tz).hour
print('------------------------------------------------')
print(DATEDAY)
fpath = get_correct_path('/videos/'+str(YEAR)+str(MONTH)+str(DATE)+'/'+str(HOUR-1))



@blueprint.route('/index')
@login_required
def index():

    return render_template('home/index.html', segment='index')


@blueprint.route('/<template>')
@login_required
def route_template(template):

    try:

        if not template.endswith('.html'):
            template += '.html'

        station_form = StationForm(request.form)
        # Detect the current page
        segment = get_segment(request)
        translator = Translator(to_lang="spanish")
        translation = translator.translate("Guten Morgen")
        streamData = []
        stationName = ''
        if template == 'videos':
            streamData = []
        

        #print(int(datetime.datetime.strptime('2019/12/3', '%Y/%m/%d').strftime("%s")))
        

        # Serve the file (if exists) from app/templates/home/FILE.html
        return render_template("home/" + template, segment=segment,dateNow = str(YEAR)+'/'+str(MONTH)+'/'+str(DATE),
                               form=station_form,file=fpath+'/'+str(HOUR-1)+'.mp4')


    except TemplateNotFound:
        return render_template('home/page-404.html'), 404

    except:
        return render_template('home/page-500.html'), 500


# Helper - Extract current page name from request
def get_segment(request):

    try:

        segment = request.path.split('/')[-1]

        if segment == '':
            segment = 'index'

        return segment

    except:
        return None



