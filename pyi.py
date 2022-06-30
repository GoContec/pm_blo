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
                            
                            cur =conn.cursor()
                            
                            cur.execute("INSERT INTO directshipping (scantime, station, operator, product, eventtype, shipid, errorcode, errormessage, siteid)  VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",(value["Scan Timestamp"],  value["Work Station ID"], value["Operator ID"],  value["Product ID"],  value["Event Type"], value["Shipment ID"], value["Error Code"], value["Error Message"], value["Site ID"]))
                            conn.commit()
                            cur.close()
                            

                    upautoidlastValue = date_send +' '+date_to_time
                    print(upautoidlastValue)
                    cur =conn.cursor()
                    qry = str("Update autoid SET value = '"+upautoidlastValue+"' WHERE id = 1")
                    cur.execute(qry)
                    conn.commit()
                    cur.close()
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



            if stationMotions[motion] < (ts-15):
                cur =conn.cursor()
                try:
                #print("INSERT INTO motions (area, timeadded, warehouse, station_type) VALUES (%s, %s, %s, %s)",(str(motion), ts, 1, 1 ))
                    cur.execute("INSERT INTO motions (area, timeadded, warehouse, station_type) VALUES (%s, %s, %s, %s)",(str(motion), ts, 2, 1 ))
                    conn.commit()
                    cur.close()
                except:
                    cur.execute("rollback")
                    cur.close()
                #print()
                stationMotions[motion] = ts
  
# define a video capture object
vid = cv2.VideoCapture("rtsp://remote:contec23@10.10.179.11:8221/Streaming/Channels/102/picture?subtype=1")
day1 = 0
while(True):
    try:
        # Capture the video frame
        # by frame
        ret, frame = vid.read()
        frame = cv2.resize(frame, (1100, 700), interpolation=cv2.INTER_AREA)
        if day1 == 0:
            frame2 = frame

        day1 = 1

        diff = cv2.absdiff(frame,frame2)
        diff_gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(diff_gray, (5, 5), 0)
        _, thresh = cv2.threshold(blur, 20, 255, cv2.THRESH_BINARY)
        dilated = cv2.dilate(thresh, None, iterations=3)
        contours, _ = cv2.findContours(
            dilated, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        movementPoints = []
        for contour in contours:
            (x, y, w, h) = cv2.boundingRect(contour)
            if cv2.contourArea(contour) < 200 and cv2.contourArea(contour) > 500:
                continue
            movementPoints.append([x, y])


            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 255, 0), 2)
            cv2.putText(frame, "Status: {}".format('Movement'), (20, 30), cv2.FONT_HERSHEY_SIMPLEX,
                    1, (255, 0, 0), 3)

        listStation = data = pickle.load(open("stationConfig.p", "rb"))
        for station in listStation:


            arrayassign = []
            i = 0
            for key  in  station['location']:
                arrayassign.append(station['location'][key])
                i = i + 1
            i = 0
            oldX = 0
            oldY = 0
            #print(arrayassign)
            for key in arrayassign:

                if i != 0:

                    cv2.rectangle(frame, (oldX, oldY),
                                (key[0], key[1]), (0, 255, 0),
                                thickness=1)

                    for point in movementPoints:
                        #print(station['name'])
                        #print(str(point[0])+'>'+str(oldX)+' and '+str(point[0])+'>'+str(oldX)+' or '+str(point[1])+'<'+str(key[0])+'and'+str(point[1])+'>'+str(key[1]))
                        if (point[0] >= oldX and point[1] > oldY) and (point[0] <= key[0] and point[1] < key[1]):
                            motions.append({station['name']:  time.time()})
                            capture_motion(station['name'])
                
                i = i + 1
                oldX = key[0]
                oldY = key[1]

            try:
                ret, frame2 = vid.read()
                if ret:
                    frame2 = cv2.resize(frame2, (1100, 700), interpolation=cv2.INTER_AREA)
                else:
                    frame2 = frame
                
                cv2.imshow("opencv", frame2)
            except:
                print('error')

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    except:
        print('error loop')

# After the loop release the cap object
vid.release()
# Destroy all the windows
cv2.destroyAllWindows()