#!/usr/bin/env python3
"""Recorta el fondo blanco de una imagen generada: solo el blanco conectado con el borde se hace transparente (los
blancos de dentro, como los ojos, se quedan). Borde suavizado. Uso: recorta.py entrada.jpg salida.png [umbral]"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from collections import deque
src, dst = sys.argv[1], sys.argv[2]
umbral = int(sys.argv[3]) if len(sys.argv) > 3 else 235
im = Image.open(src).convert('RGB'); a = np.asarray(im).astype(np.int16)
h, w, _ = a.shape
claro = (a.min(axis=2) >= umbral)
fondo = np.zeros((h, w), bool)
q = deque()
for x in range(w):
    for y in (0, h - 1):
        if claro[y, x] and not fondo[y, x]: fondo[y, x] = True; q.append((y, x))
for y in range(h):
    for x in (0, w - 1):
        if claro[y, x] and not fondo[y, x]: fondo[y, x] = True; q.append((y, x))
while q:
    y, x = q.popleft()
    for ny, nx in ((y-1,x),(y+1,x),(y,x-1),(y,x+1)):
        if 0 <= ny < h and 0 <= nx < w and claro[ny, nx] and not fondo[ny, nx]: fondo[ny, nx] = True; q.append((ny, nx))
alpha = Image.fromarray(((~fondo) * 255).astype(np.uint8))
# contrae un píxel y suaviza: sin halo blanco en el borde
alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
al = np.asarray(alpha).astype(np.float32) / 255
rgb = a.astype(np.float32)
# quita el blanco que se cuela en el borde semitransparente (despill)
mezcla = np.clip((rgb - 255 * (1 - al[..., None])) / np.maximum(al[..., None], 0.02), 0, 255)
rgb = np.where(al[..., None] < 0.999, mezcla, rgb)
out = np.dstack([rgb.astype(np.uint8), (al * 255).astype(np.uint8)])
# recorta al contenido
ys, xs = np.where(al > 0.01); y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
Image.fromarray(out[y0:y1, x0:x1], 'RGBA').save(dst)
print('ok', dst, f'{x1-x0}x{y1-y0}')
