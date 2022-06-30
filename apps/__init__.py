# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from importlib import import_module
import time, requests
import threading
#from apps.report.models import motions

print(int(time.time()))
db = SQLAlchemy()
login_manager = LoginManager()


def register_extensions(app):
    db.init_app(app)
    login_manager.init_app(app)


def register_blueprints(app):
    for module_name in ('authentication', 'home', 'camera', 'report'):
        module = import_module('apps.{}.routes'.format(module_name))
        app.register_blueprint(module.blueprint)


def configure_database(app):

    @app.before_first_request
    def initialize_database():
        db.create_all()

    @app.teardown_request
    def shutdown_session(exception=None):
        db.session.remove()
        db.session.close()

def get_mouse_posn(event):
    global topy, topx
    topx, topy = event.x, event.y
    print(topx)


def maintenance():
    """ Background thread doing various maintenance tasks """
    readText = 1
    print("Deepblu")
    # while True:
    #     time.sleep(10)
    #     print("Deepblu")
    #     # do things...
    #     response = requests.get('https://deepbluapi.gocontec.com/autoreceive/direct-shipments?id=' + str(33966071),
    #                             headers={'Content-Type': 'application/json',
    #                                      'Authorization': 'Basic QVVUT1JFQ0VJVkU6YXV0b0AxMjM='}
    #                             )
    #     if response.status_code == 200:
    #         print("resp")
    #         print(response.content.decode("utf-8"))
    #         print("=========")
    #
    #         if (response.content.decode("utf-8")  != ""):
    #             print("=========DDDDDD")
    #             result = response.json()
    #             print(result)
    #             for value in result:
    #                  values = {"scantime": value["Scan Timestamp"],
    #                                                "station": value["Work Station ID"],
    #                                                "operator": value["Operator ID"],
    #                                                "product": value["Product ID"],
    #                                                "eventtype": value["Event Type"],
    #                                                "shipid": value["Shipment ID"],
    #                                                "errorcode": value["Error Code"],
    #                                                "errormessage": value["Error Message"] }
                     #motions.add_data(values)


                # autoids = autoid().request_loader()
                # if autoids != None:
                #     upautoidlastValue  = autoids.value
                #     db.session.query(autoid).filter(autoid.id == autoids.id).update({'value': len(result) + upautoidlastValue})
                #     db.session.commit()

            # print(result)


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    global rect_id, stop_event, stationArray, stations, showStation
    global topy, topx, botx, boty, mouse_yaxis, mouse_xaxis
    #app.bind('<Button-1>', get_mouse_posn)
    register_extensions(app)
    register_blueprints(app)
    configure_database(app)
    print("===================================================================")


    return app

def thread_deepblu():
    threading.Thread(target=maintenance, daemon=True).start()
