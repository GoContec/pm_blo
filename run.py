# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from flask_migrate import Migrate
from sys import exit
from decouple import config

from apps.config import config_dict
from apps import create_app, db, thread_deepblu
from apps.report.models import motions
from apps.camera.autoid import autoid
import time, requests, datetime
from time import strftime
import threading


# WARNING: Don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)

# The configuration
get_config_mode = 'Debug' if DEBUG else 'Production'

try:

    # Load the configuration using the default values
    app_config = config_dict[get_config_mode.capitalize()]

except KeyError:
    exit('Error: Invalid <config_mode>. Expected values [Debug, Production] ')

app = create_app(app_config)
Migrate(app, db)
thread_deepblu()



if DEBUG:
    app.logger.info('DEBUG       = ' + str(DEBUG))
    app.logger.info('Environment = ' + get_config_mode)
    app.logger.info('DBMSssss        = ' + app_config.SQLALCHEMY_DATABASE_URI)

def maintenance():
    with app.app_context():


            while True:
                time.sleep(119)
                autoid = str("Select value from autoid WHERE id = 1 limit 1")

                autoids = db.session.execute(autoid)

                db.session.commit()
                db.session.remove()
                db.session.close()
                auditval = ''
                for autoid in autoids:
                    last_Date_from = autoid['value'].strip().split(' ')
                    auditval = autoid['value']

                print(last_Date_from)
                last_time = (
                    int(datetime.datetime.strptime(auditval.strip() + ',000', "%Y-%m-%d %H:%M:%S,%f").timestamp()))
                last_time = last_time + 120

                if int(time.time()) > int(last_time):
                    last_Date_to = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(int(last_time)))
                    last_Date_to = last_Date_to.split(' ')
                    if last_Date_from[0] != last_Date_to[0]:
                        date_send = last_Date_to[0]
                        date_from_time = "00:00:00"
                        date_to_time = last_Date_to[1]
                    else:
                        date_send = last_Date_from[0]
                        date_from_time = last_Date_from[1]
                        date_to_time = last_Date_to[1]
                    date_to_time = '21:00:00'
                    print(date_send)
                    print(date_from_time)
                    print(date_to_time)
                    response = requests.get('https://deepbluapi.gocontec.com/autoreceive/direct-shipments?_format=json&date='+date_send+'&s_time='+date_from_time+'&e_time='+date_to_time+'',
                                            headers={'Content-Type': 'application/json',
                                                     'Authorization': 'Basic QVVUT1JFQ0VJVkU6YXV0b0AxMjM='}
                                            )
                    if response.status_code == 200:
                        data_time = []
                        if (response.content.decode("utf-8")  != ""):
                            result = response.json()
                            #print(result)
                            s = 0
                            for value in result:
                                 s = 1
                                 data_time = value["Scan Timestamp"]
                                 values = {"scantime": value["Scan Timestamp"],
                                                               "station": str(value["Work Station ID"]),
                                                               "operator": value["Operator ID"],
                                                               "product": value["Product ID"],
                                                               "eventtype": value["Event Type"],
                                                               "shipid": value["Shipment ID"],
                                                               "errorcode": value["Error Code"],
                                                               "errormessage": value["Error Message"],
                                                               "siteid": value["Site ID"] }

                                 print(values)
                                 #print("================")
                                 motions.add_data(values)

                        upautoidlastValue = date_send +' '+date_to_time
                        print(upautoidlastValue)
                        db.session.query(autoid).filter(autoid.id == 1).update(
                            {'value':  upautoidlastValue})
                        db.session.commit()
                        db.session.remove()
                        db.session.close()


#threading.Thread(target=maintenance, daemon=True).start()

if __name__ == "__main__":

    app.run()

