#!/usr/bin/env bash
# Mezcla final: el vídeo del motor (voz + efectos) con la música debajo (ducking por la voz) y loudnorm a -14 LUFS.
#   mezcla.sh <video_limpio.mp4> <musica.mp3> <desde_s> <salida_con_musica.mp4> [db]
set -euo pipefail
V=$1; M=$2; DESDE=$3; OUT=$4; DB=${5:--24}
# el fundido de salida acaba con el vídeo (antes estaba fijo para uno de 58 s)
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
FADE=$(awk -v d="$DUR" 'BEGIN { printf "%.2f", (d > 3 ? d - 2.4 : 0) }')
ffmpeg -y -loglevel error -i "$V" -ss "$DESDE" -i "$M" -filter_complex "
  [1:a]atrim=0:60,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=1.2,afade=t=out:st=${FADE}:d=2.4,volume=${DB}dB[m];
  [0:a]asplit=2[v][vsc];
  [m][vsc]sidechaincompress=threshold=0.05:ratio=4:attack=40:release=500:makeup=1[md];
  [v][md]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1:LRA=11[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k "$OUT"
ffmpeg -loglevel info -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -A8 "Summary" | head -12
