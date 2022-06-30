# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from flask import render_template, Response , request, jsonify, stream_with_context, session
from apps.camera.camera import VideoCamera

from apps.camera.cameravideo import VideoDataCamera

from apps import db,login_manager
from apps.camera import blueprint
from flask_login import login_required
from apps.report.models import motions
import pickle
import os
import json

from apps.camera.models import stationconfig


@blueprint.route('/video_feed')
@login_required
def video_feed():

    return Response(stream_with_context(gen(VideoCamera())),
                    mimetype='multipart/x-mixed-replace; boundary=frame')



@blueprint.route('/station_feed')
@login_required
def station_feed():

    return Response(stream_with_context(gen(VideoDataCamera())),
                    mimetype='multipart/x-mixed-replace; boundary=frame')



@blueprint.route('/add_episode_tag', methods=['POST'])
def add_episode_tag():
   
    responseBody = {"results": "sdadasd"}
    data = request.get_json()
    tag = data['tag']
    station = data['station']
    starttime = data['starttime']
    endtime = data['endtime']
    stationTime = motions.add_episode_tag(tag, station, starttime, endtime)
    return jsonify(responseBody), 200

@blueprint.route('/get_station_name', methods=['POST'])
def get_station_name():

    data = request.get_json()
    x = data['x']
    y = data['y']
    stations = []
    listStation =  get_station_config()
    station_name = None
    session['search_station'] = None
    for station in listStation:

        arrayassign = []
        i = 0
        for key in station['location']:
            arrayassign.append(station['location'][key])
            i = i + 1
        i = 0
        oldX = 0
        oldY = 0
        for key in arrayassign:

            if i != 0:
                if (x >= oldX and y > oldY) and (x <= key[0] and y < key[1]):
                    station_name = station['name']
                    session['search_station'] = station_name

            i = i + 1
            oldX = key[0]
            oldY = key[1]
        responseBody = {"results": station_name}

    return jsonify(responseBody), 200

@blueprint.route('/add_station_config', methods=['POST'])
def add_station_config():
    responseBody = {"results": "sdadasd"}
    data = request.get_json()
    s_name = data['s_name']
    o_area = data['o_area']
    stations = []
    listStation =  get_station_config()
    for station in listStation:
        if station['name'] != s_name:
            stations.append(station)

    stations.append({'name': s_name, 'location': o_area})
    #str_station = " ".join(str(x) for x in stations)
    row_json = json.dumps(stations)
    print(row_json)
    stationCon = stationconfig(**{"warehouse": "Bloomington", "station": "test", "configdata":row_json})

    db.session.add(stationCon)
    db.session.commit()
    db.session.remove()
    db.session.close()

    addStationPickle = {}
    addStationPickle = stations
    pickle.dump(addStationPickle, open(get_correct_path("stationConfig.p"), "wb"))
    return jsonify(responseBody), 200


def strToBinary(s):
    bin_conv = []

    for c in s:
        # convert each char to
        # ASCII value
        ascii_val = ord(c)

        # Convert ASCII value to binary
        binary_val = bin(ascii_val)
        bin_conv.append(binary_val[2:])

    return (' '.join(bin_conv))

def get_correct_path(relative_path):
    p = os.path.abspath(".").replace('/dist', "")
    return os.path.join(p, relative_path)

def get_station_config():
    try:
        data = pickle.load(open(get_correct_path("stationConfig.p"), "rb"))
    except EOFError:
        data = list()
    return data
# Errors

@login_manager.unauthorized_handler
def unauthorized_handler():
    return render_template('home/page-403.html'), 403


@blueprint.errorhandler(403)
def access_forbidden(error):
    return render_template('home/page-403.html'), 403


@blueprint.errorhandler(404)
def not_found_error(error):
    return render_template('home/page-404.html'), 404


@blueprint.errorhandler(500)
def internal_error(error):
    return render_template('home/page-500.html'), 500


def gen(camera):
    while True:
        #get camera frame
        frame = camera.get_frame()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')