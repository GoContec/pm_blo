# import required libraries
from vidgear.gears import WriteGear
import cv2
import time
import os

from datetime import datetime
import pytz
other_tz = pytz.timezone('US/Eastern')

# datetime object containing current date and time


# define suitable (Codec,CRF,preset) FFmpeg parameters for writer
output_params = {"-vcodec":"libx264", "-crf": 0, "-preset": "fast"}

pathVideo = "rtsp://remote:contec23@10.10.179.11:8221/Streaming/Channels/102/picture?subtype=1";
# Open suitable video stream, such as webcam on first index(i.e. 0)
stream = cv2.VideoCapture(pathVideo) 

# Define writer with defined parameters and suitable output filename for e.g. `Output.mp4`



    # font
font = cv2.FONT_HERSHEY_SIMPLEX
  
# org
org = (10, 50)
  
# fontScale
fontScale = 0.5
   
# Blue color in BGR
color = (255, 155, 0)
  
# Line thickness of 2 px
thickness = 2

def get_correct_path(relative_path):
    p = os.path.abspath(".").replace('/dist', "")
    return os.path.join(p, relative_path)

YEAR        = datetime.now().astimezone(other_tz).year
MONTH       = datetime.now().astimezone(other_tz).month
DATE        = datetime.now().astimezone(other_tz).day
HOUR        = datetime.now().astimezone(other_tz).hour
fpath = get_correct_path('apps/static/videos/'+str(YEAR)+str(MONTH)+str(DATE)+'/'+str(HOUR))
if not os.path.exists(fpath):
        exitfile = 1
        os.makedirs(fpath)
writer = WriteGear(output_filename = fpath+'/'+str(HOUR)+'.mp4', logging = True, **output_params)
# loop over
while True:
  try:
    YEAR        = datetime.now().astimezone(other_tz).year
    MONTH       = datetime.now().astimezone(other_tz).month
    DATE        = datetime.now().astimezone(other_tz).day
    HOUR        = datetime.now().astimezone(other_tz).hour
    
    fpath = get_correct_path('apps/static/videos/'+str(YEAR)+str(MONTH)+str(DATE)+'/'+str(HOUR))
    exitfile = 0
    if not os.path.exists(fpath):
        exitfile = 1
        os.makedirs(fpath)
    # read frames from stream
    (grabbed, frame) = stream.read()

    # check for frame if not grabbed
    try:
      if not grabbed:
        stream.release()
        stream = cv2.VideoCapture(pathVideo) 
    

      # {do something with the frame here}
      # lets convert frame to gray for this example
      gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

      now = datetime.now().astimezone(other_tz)
      

      # dd/mm/YY H:M:S
      dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
      print("date and time =", dt_string)


      gray = cv2.putText(gray, dt_string, org, font, 
                    fontScale, color, thickness, cv2.LINE_AA)
      
      # write gray frame to writer
      if exitfile == 0:
        try:
          writer.write(gray)
        except:
          print('error')
      else:
        writer.close()
        writer = WriteGear(output_filename = fpath+'/'+str(HOUR)+'.mp4', logging = False, **output_params)

      # Show output window
      cv2.imshow("Output Gray Frame", gray)
    except:
      print('test')

    # check for 'q' key if pressed
    key = cv2.waitKey(1) & 0xFF
    if key == ord("q"):
        break
  except:
    print('error')

# close output window
cv2.destroyAllWindows()

# safely close video stream
stream.release()

# safely close writer
writer.close() 