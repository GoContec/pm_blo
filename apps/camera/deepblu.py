import os
import json
import os.path
import requests
from datetime import datetime 
import socket
# from apps.camera.directshipping import directshipping
#
# from apps.camera.autoid import autoid
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class Deepblu(db.Model):

    def get_shipment_detail(self, id=33966071):
        response = requests.get('https://deepbluapi.gocontec.com/autoreceive/direct-shipments?id='+id,
                                            headers={'Content-Type': 'application/json',
                                            'Authorization': 'Basic QVVUT1JFQ0VJVkU6YXV0b0AxMjM=' }
                                            )
        if response.status_code == 200:
            print("resp")
            print(response.content.decode("utf-8") )
            print("=========")
            # if (response.content.decode("utf-8")  != ""):
            #     result = response.json()
            #     for value in result:
            #         directship = directshipping(**{"scantime": value["Scan Timestamp"],
            #                                        "station": value["Work Station ID"],
            #                                        "operator": value["Operator ID"],
            #                                        "operator": value["Product ID"],
            #                                        "operator": value["Event Type"],
            #                                        "operator": value["Sub Event Type"],
            #                                        "shipid": value["Shipment ID"],
            #                                        "errorcode": value["Error Code"],
            #                                        "errormessage": value["Error Message"]})
            #         # db.session.add(directship)
            #         # db.session.commit()
            #
            #     autoids = autoid().request_loader()
            #     if autoids != None:
            #         upautoidlastValue  = autoids.value
            #         # db.session.query(autoid).filter(autoid.id == autoids.id).update({'value': len(result) + upautoidlastValue})
            #         # db.session.commit()




                #print(result)
        return response


