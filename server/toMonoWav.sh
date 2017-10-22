lame --decode $1 buff.wav
sox buff.wav -b 16 -c 1 -r 16k -t wav outp.wav
