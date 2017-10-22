from http.server import BaseHTTPRequestHandler
from urllib import parse
import ssl
import urllib
import sys
import os
from os import environ, path

from pocketsphinx.pocketsphinx import *
from sphinxbase.sphinxbase import *

MODELDIR = "ru1"
DATADIR = ""

# Create a decoder with certain model
config = Decoder.default_config()
config.set_string('-hmm', path.join(MODELDIR,""))
config.set_string('-lm', path.join(MODELDIR, 'ru.lm'))
config.set_string('-dict', path.join(MODELDIR, 'ru.dic'))
decoder = Decoder(config)
decoder.start_utt()

def recognize(file):
  print("save",file)
  newName = os.path.basename(parse.urlparse(file).path)
  os.system("wget -O "+newName+" "+file)
  print(newName)
  os.system("sh toMonoWav.sh "+newName+" "+newName+".wav")
  stream = open("outp.wav", 'rb')
  while True:
    buf = stream.read(1600)
    if buf:
      decoder.process_raw(buf, False, False)
    else:
      break
  if decoder.hyp():
    str = decoder.hyp().hypstr
  else:
    str = " "
  #decoder.end_utt()
  try:
     os.system("rm "+newName)
  except Exception:
     print("exception")
  decoder.end_utt()
  decoder.start_utt()  
  return str

class  GetHandler(BaseHTTPRequestHandler):

    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        parsed_path = parse.urlparse(self.path)
        self.send_response(200)
        self.send_header('Content-Type','text/plain; charset=utf-8')
        self.end_headers()
        arr = parse.parse_qs(parsed_path.query)
        try:
            if 'url' in arr and len(arr['url'])>0 and arr['url'][0]:
                rec = recognize(arr["url"][0])
                self.wfile.write(rec.encode())
                print("Text: ",rec)
                #self.wfile.write(parsed_path.query.encode())
        except Exception:
             e = sys.exec_info()[1]
             print("exception",e.args)
    def do_HEAD(self):
        self._set_headers()
        
    def do_POST(self):
        # Doesn't do anything with posted data
        self._set_headers()
        #self.wfile.write("<html><body><h1>POST!</h1></body></html>")
        

from http.server import HTTPServer
server = HTTPServer (('95.213.170.76',443 ), GetHandler)
server.socket = ssl.wrap_socket (server.socket,keyfile='key.pem',certfile='cert.pem', server_side=True)
print ('Starting httpd...')
server.serve_forever()
print('worked')
