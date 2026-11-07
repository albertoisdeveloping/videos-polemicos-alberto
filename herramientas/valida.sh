#!/usr/bin/env bash
# Validación práctica del mp4 final: fotogramas cada segundo a 390 px de ancho (como un móvil), loudness, duración, saltos.
#   valida.sh <video.mp4> <carpeta_evidencia>
set -euo pipefail
V=$1; E=$2; mkdir -p "$E/fot"
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V"); echo "duración: $D s"
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate -of csv=p=0 "$V"
for s in $(seq 0 1 ${D%.*}); do ffmpeg -y -loglevel error -ss $s -i "$V" -frames:v 1 -vf scale=390:-1 "$E/fot/f-$(printf %02d $s).jpg"; done
python3 -I - "$E" <<'PY'
import sys, glob
from PIL import Image, ImageDraw
E=sys.argv[1]; fs=sorted(glob.glob(E+'/fot/f-*.jpg')); ims=[Image.open(f) for f in fs]; w,h=ims[0].size; cols=10; rows=(len(ims)+cols-1)//cols
out=Image.new('RGB',(cols*w,rows*(h+24)),'white'); d=ImageDraw.Draw(out)
for i,(f,im) in enumerate(zip(fs,ims)): x=(i%cols)*w; y=(i//cols)*(h+24); out.paste(im,(x,y)); d.text((x+6,y+h+5),f.split('f-')[-1][:2]+' s',fill='black')
out.save(E+'/390px.jpg'); print('hoja:', E+'/390px.jpg', len(ims), 'fotogramas')
PY
echo "--- loudness"; ffmpeg -i "$V" -af ebur128=peak=true -f null - 2>&1 | grep -A8 Summary | grep "I:\|LRA:\|Peak:"
