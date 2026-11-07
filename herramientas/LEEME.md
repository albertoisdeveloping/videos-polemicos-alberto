# Herramientas del estilo híbrido (IA de imagen + motor)

No sustituyen a `motor/`: van después (imágenes) o al final (mezcla, validación, entrega). Cómo se decide qué pedir a
la IA y qué dibujar: `guia/aprendizajes.md`. El reel hecho así, entero: `ejemplo/desconocidos/`.

| Herramienta | Qué hace | Cómo |
|---|---|---|
| `higgsfield.py` | Presupuesta (`/estimate`) y genera imágenes en Higgsfield con tope duro de 2 $ por reel; apunta cada gasto en `ia/gasto.json` del proyecto | `cd proyectos/<reel> && python3 ../../herramientas/higgsfield.py gen dueno xai/grok-imagine-image-2.0 '{"prompt":"...","resolution":"1k","aspect_ratio":"3:4","quality":"medium"}'` |
| `recorta.py` | Quita el fondo blanco de una imagen generada (solo el blanco pegado al borde) y deja un png con transparencia, sin halo | `python3 herramientas/recorta.py ia/out/dueno.png video/img/dueno.png` (necesita numpy y pillow: `pip3 install numpy pillow`) |
| `reparto.mjs` | Frases de personaje con otra voz de ElevenLabs, montadas dentro de la voz del locutor sin cortarla | `node herramientas/reparto.mjs <proyecto>` (cabecera del script) |
| `mezcla.sh` | Música debajo de la voz con ducking y loudnorm a -14 LUFS / -1 dBTP | `herramientas/mezcla.sh limpio.mp4 cancion.mp3 <desde_s> con-musica.mp4 [-24]` |
| `valida.sh` | Fotogramas a 390 px cada segundo en una hoja, loudness y duración (necesita pillow) | `herramientas/valida.sh video.mp4 carpeta/` |
| `entrega.sh` | Todo lo anterior tras el render, más portada y copia a `~/Desktop/reel-<nombre>/` | ver cabecera del script |
| `personaje.md` | Prompts de un personaje recurrente de ejemplo y de los dos estilos (cartoon premium y editorial) | copiar, cambiar el personaje y la pose |

Claves (nunca en el chat, nunca se imprimen): la de la voz con `node motor/clave.mjs` y la de Higgsfield, opcional, con
`node motor/clave.mjs higgsfield`. Las dos se guardan en `.env.local`, que no se sube a ningún sitio.
Sin clave de Higgsfield el método funciona igual: todo lo dibuja el motor.
