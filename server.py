import os
from watson_visual_recognition_tool import app

def runserver():
  port = int(os.getenv('VCAP_APP_PORT', 3000))
  #port = int(os.getenv('VCAP_APP_PORT', 8080))
  app.run(host='0.0.0.0', port=port)

if __name__ == '__main__':
  runserver()