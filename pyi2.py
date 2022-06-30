import tkinter as tk
import psycopg2
import pickle
import time, calendar, requests, datetime
try: 
 conn = psycopg2.connect(database="postgres", user="postgres", password="Contec123", host="10.10.100.120")
 print("connected")
except:
 print ("I am unable to connect to the database")
 

motions = []
stationMotions = {}
lastMotion = {}


import cv2
import threading
import schedule

print(cv2.__version__)

def maintenance():
    print("waiting...") 


    while True:
        time.sleep(119)
        

        cur =conn.cursor()
        autoid = str("Select value from autoid WHERE id = 1 limit 1")
        autoids = cur.execute(autoid)
        autoids = cur.fetchall()
        cur.close()
        auditval = ''
        for autoid in autoids:
            last_Date_from = autoid[0].strip().split(' ')
            auditval  = autoid[0]

        last_time = (int(datetime.datetime.strptime(auditval.strip()+',000', "%Y-%m-%d %H:%M:%S,%f").timestamp()))
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
  
            try:
                response = requests.get('https://deepbluapi.gocontec.com/autoreceive/direct-shipments?_format=json&date='+date_send+'&s_time='+date_from_time+'&e_time='+date_to_time+'',
                                        headers={'Content-Type': 'application/json',
                                                    'Authorization': 'Basic QVVUT1JFQ0VJVkU6YXV0b0AxMjM='}
                                        )
                if response.status_code == 200:
                    data_time = []
                    if (response.content.decode("utf-8")  != ""):
                        result = response.json()
                        s = 0
                        for value in result:
                            s = 1
                            data_time = value["Scan Timestamp"]
                            
                            # cur =conn.cursor()
                            
                            # cur.execute("INSERT INTO directshipping (scantime, station, operator, product, eventtype, shipid, errorcode, errormessage, siteid)  VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",(value["Scan Timestamp"],  value["Work Station ID"], value["Operator ID"],  value["Product ID"],  value["Event Type"], value["Shipment ID"], value["Error Code"], value["Error Message"], value["Site ID"]))
                            # conn.commit()
                            # cur.close()
                            

                    upautoidlastValue = date_send +' '+date_to_time
                    print(upautoidlastValue)
                    # cur =conn.cursor()
                    # qry = str("Update autoid SET value = '"+upautoidlastValue+"' WHERE id = 1")
                    # cur.execute(qry)
                    # conn.commit()
                    # cur.close()
            except:
                print("Unable to connect deepblu")




def job():
    print("I'm working...")

    # cur =conn.cursor()
    # autoid = str("select * from test_loop(1)")

    # autoids = cur.execute(autoid)

    # conn.commit() 
    # cur.close()

schedule.every().day.at("00:05").do(job)

def pendingrun():
    while True:
        schedule.run_pending()
        time.sleep(1)


#threading.Thread(target=maintenance, daemon=True).start()
threading.Thread(target=pendingrun, daemon=True).start()
def capture_motion(motion):
        ts = int(time.time())
        if len(motions) > 0:
            if motion not in stationMotions:
                stationMotions[motion] = 0
            if motion not in lastMotion:
                lastMotion[motion] = 0



            if stationMotions[motion] < (ts-5):
                # cur =conn.cursor()
                
                # #print("INSERT INTO motions (area, timeadded, warehouse, station_type) VALUES (%s, %s, %s, %s)",(str(motion), ts, 1, 1 ))
                # cur.execute("INSERT INTO motions (area, timeadded, warehouse, station_type) VALUES (%s, %s, %s, %s)",(str(motion), ts, 1, 1 ))
                # conn.commit()
                # cur.close()
                #print()
                stationMotions[motion] = ts

def get_correct_path(relative_path):
    p = os.path.abspath(".").replace('/dist', "")
    return os.path.join(p, relative_path)
# define a video capture object
from vidgear.gears import WriteGear
cap = cv2.VideoCapture("rtsp://remote:contec23@10.10.179.11:8221/Streaming/Channels/101/picture?subtype=1")
import cv2
import numpy as np
import os
import time
import random
from os.path import isfile, join
img_array = []
fourcc = cv2.VideoWriter_fourcc(*'XVID')
out = cv2.VideoWriter('output222.avi', fourcc, 30.0, (800,480))

pathIn= get_correct_path('static/')
pathOut = get_correct_path('video.mp4')
fps = 25.0



# def convert_frames_to_video(pathIn,pathOut,fps):
#     frame_array = []
#     files = [f for f in os.listdir(pathIn) if isfile(join(pathIn, f))]
#     #for sorting the file names properly
#     #files.sort(key = lambda x: int(x[5:-4]))
#     for i in range(len(files)):
#         filename=pathIn + files[i]
#         #reading each files
#         img = cv2.imread(filename)
#         print(filename)
#         height, width, layers = img.shape
#         size = (width,height)
#         print(size)
#         #inserting the frames into an image array
#         frame_array.append(img)
#     out = cv2.VideoWriter(pathOut,cv2.VideoWriter_fourcc(*'mp4v'), fps, size)
#     for i in range(len(frame_array)):
#         # writing to a image array
#         out.write(frame_array[i])
#     out.release()

# convert_frames_to_video(pathIn, pathOut, fps)

out = cv2.VideoWriter()
out.open('output.mp4',fourcc,fps,(720,720),True)
while cap.isOpened():
    ret,image = cap.read()

    

    if image is None: 
        break
    height, width = image.shape[:2]
    mask = np.zeros((height, width), dtype=np.uint8)
    points = np.array([[[305,80],[-100,493],[1123,513],[897,80],[700,80],[613,80]]])
    cv2.fillPoly(mask, points, (255))
    res = cv2.bitwise_and(image,image,mask = mask)

    rect = cv2.boundingRect(points) # returns (x,y,w,h) of the rect
    cropped = res[rect[1]: rect[1] + rect[3], rect[0]: rect[0] + rect[2]]

    height2, width2 = res.shape[:2]

    img_array.append(res)
    for i in range(len(img_array)):
        if img_array[i] is None:
            break
        out.write(img_array[i])
        gmt = time.gmtime()
        ts = calendar.timegm(gmt)
        fillenameImage = str(str(ts)+'-'+str(random.randint(100000,999999)))
        cv2.imwrite(get_correct_path("static/%s.png") % fillenameImage, image)
        img = cv2.imread(get_correct_path("static/%s.png") % fillenameImage)
        height, width, layers = (720,720,0)
        size = (width,height)
        
        out.write(img)
        
        img_array = []
        print('try')
        
cap.release()

cv2.destroyAllWindows()

#out = cv2.VideoWriter('hwyeni.mp4',cv2.VideoWriter_fourcc(-), 24, size)
fourcc = cv2.VideoWriter_fourcc(*'XVID')
out = cv2.VideoWriter('output222.avi', fourcc, 30.0, (800,480))
for i in range(len(img_array)):
    if img_array[i] is None:
       break
    out.write(img_array[i])

out.release()

