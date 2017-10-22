#!/usr/bin/env python
from os import environ, path

from pocketsphinx.pocketsphinx import *
from sphinxbase.sphinxbase import *

MODELDIR = "ru"
DATADIR = ""


# Create a decoder with certain model
config = Decoder.default_config()
config.set_string('-hmm', path.join(MODELDIR,"zero_ru.cd_semi_4000"))
config.set_string('-lm', path.join(MODELDIR, 'ru.lm'))
config.set_string('-dict', path.join(MODELDIR, 'ru.dic'))
#config.set_string('-samprate', '8000')
#config.set_string('-remove_noise', 'no')
#config.set_string('-logfn', '/dev/null')
# decoder = Decoder(config)

# Decode streaming data.
decoder = Decoder(config)
decoder.start_utt()
file = input("Please enter file(or '/exit'): ")
while file != "/exit" :
  stream = open(path.join(DATADIR, file), 'rb')
  while True:
    buf = stream.read(1024)
    if buf:
      decoder.process_raw(buf, False, False)
    else:
      break
  print ('Best hypothesis segments: ', decoder.hyp().hypstr)
  file = input("Please enter file(or '/exit'): ")
decoder.end_utt()


