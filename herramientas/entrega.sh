#!/usr/bin/env bash
# Tras el render final (motor/render.mjs): versión limpia a -14 LUFS, versión con música (ducking), portada, validación
# a 390 px y copia a ~/Desktop/<nombre>/.
#   herramientas/entrega.sh <carpeta de salida> <nombre corto> <musica.mp3> <segundo de entrada en la canción> <segundo de la portada> [db música]
# Ejemplo (el reel de los desconocidos):
#   herramientas/entrega.sh salida/2026-10-25-desconocidos desconocidos ia/musica/The_25th_Hour.mp3 1.1 4.6 -24
set -euo pipefail
# O absoluta: con una ruta relativa, la validación caía en una carpeta anidada
H=$(cd "$(dirname "$0")" && pwd); O=$(cd "$1" && pwd); N=$2; M=$3; DESDE=$4; PORTADA=$5; DB=${6:--24}; D=~/Desktop/reel-$N
cd "$O"; R=$(ls -t *.mp4 | grep -v "con-musica\|limpio" | head -1)
ffmpeg -y -loglevel error -i "$R" -af "loudnorm=I=-14:TP=-1:LRA=11" -c:v copy -c:a aac -b:a 192k "$N-limpio.mp4"
"$H/mezcla.sh" "$R" "$M" "$DESDE" "$N-con-musica.mp4" "$DB" | grep "I:\|Peak:" || true
ffmpeg -y -loglevel error -ss "$PORTADA" -i "$N-limpio.mp4" -frames:v 1 -q:v 2 portada.jpg
"$H/valida.sh" "$N-con-musica.mp4" "$O/validacion" | tail -4
mkdir -p "$D"; cp "$N-con-musica.mp4" "$N-limpio.mp4" portada.jpg caption.txt "$D/"
ls -la "$O" "$D"
