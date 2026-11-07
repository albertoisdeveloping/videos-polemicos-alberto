# Los desconocidos deciden: cómo se hizo

Reel TOFU sobre los trial reels (enemigo: «tu alcance son tus seguidores»), con una voz clonada de ElevenLabs. Lo que
cuenta: Instagram enseña cada vídeo primero a un grupo pequeño de desconocidos y, si responden, lo abre al siguiente
círculo; tus seguidores casi no pintan nada; con los trial reels esa prueba la haces tú con tres principios.

## Los tres hooks

| Hook | Por qué sí o no |
|---|---|
| «¿Sabías que tus seguidores casi no deciden cuánta gente ve tus vídeos?» | Dice lo sorprendente, pero no se ve pasar: es una idea, no una escena. Se queda como segunda frase («ellos casi no pintan nada»). |
| «¿Por qué un vídeo de alguien con doscientos seguidores llega a un millón de personas y el tuyo se queda en trescientas visitas?» | Empieza por cifras sin fuente (el millón) y es la comparación de siempre; suena a envidia, no a mecanismo. |
| **«¿Sabías que cada vídeo que subes lo ven primero un puñado de desconocidos, y son ellos los que deciden si lo ve alguien más?»** | Elegido. Dice el tema con palabras de la calle, le habla a «tú» (tu vídeo), contradice lo que cree quien no publica (que las visitas salen de los seguidores) y deja la pregunta abierta: ¿quiénes son y por qué deciden ellos? Se ve pasar desde el fotograma 0: el estadio a oscuras y la primera fila que se enciende. |

## El concepto visual

Un solo mundo para todo el reel, el estadio a oscuras (en `plan.md`). Estilo híbrido: los personajes son imágenes de
IA recortadas (Higgsfield, Grok Imagine Image 2.0 a 1K) y el mundo, la cámara, la luz y los
efectos los hace el motor. Dos muestras de estilo para elegir con el creador: A, cartoon premium (líneas limpias, ojos
grandes, color plano con sombra suave) y B, ilustración editorial (grano, paleta corta, sin líneas).

## Las imágenes de IA (video/img/)

| Fichero | Qué es | Origen |
|---|---|---|
| `dueno-movil.png` | Tú: el dueño del negocio mirando el móvil (delantal verde) | Higgsfield, xai/grok-imagine-image-2.0, 1K 3:4, 25-oct-2026 (muestra A) |
| `fila.png` | La primera fila: seis desconocidos con el móvil | El mismo modelo, 1K 16:9, con la muestra A de referencia de estilo |
| `amigos.png` | Tus seguidores: cuatro amigos en su banco | El mismo modelo, 1K 4:3, con la muestra A de referencia |
| `dueno-camina.png` | Tú, saliendo a la pista (frase 4) | El mismo modelo, 1K 3:4, con la muestra A de referencia |
| `dueno-trofeo.png` | Tú, con el móvil en alto (frase 9) | El mismo modelo, 1K 3:4, con la muestra A de referencia |
| `_muestra-B-editorial.png` | La muestra del estilo B (no se usa en el vídeo) | El mismo modelo, 1K 3:4 |

Todas se generaron sobre fondo blanco y se recortaron en local (el fondo conectado al borde pasa a transparente; los
blancos de dentro, como los ojos, se quedan). Las versiones a oscuras se hacen en el motor pintando negro solo sobre
el dibujo.

## Gasto

| Qué | Cuánto |
|---|---|
| Higgsfield: 2 muestras de estilo (0,06 $ cada una) + fila, amigos y dos poses más del dueño (0,07 $ cada una, con referencia) | 0,40 $ (tope 2 $) |
| ElevenLabs: dos tomas de la voz (la segunda, al recortar el guion de 62 a 59 s) | ~0,6 $ |

## Decisiones y supuestos

- El guion se recortó de 193 a 185 palabras para quedar en 58,7 s (el tope es 60 s).

## Música

«Really Slow Motion - The 25th Hour» (Motivational). Medido en local: la canción arranca
muy baja (-49 dB) y sube de golpe a -21 dB en su segundo 29,5; se entra en la canción con 1,0 s de adelanto para que
ese subidón caiga en «llenar el estadio» (28,3-28,8 s). A -24 dB bajo la voz, con ducking (sidechaincompress 4:1) y
loudnorm a -14 LUFS / -1 dBTP. Dos mp4 en salida/: con música (para ver) y limpio (el que va aquí) (para poner la canción desde la
biblioteca de Instagram al publicar).

## Lo que se arregló al revisar

- El estadio apagado no se veía (negro sobre negro): siluetas azul noche con un borde de luz, una línea tenue por
  fila y los puntos lejanos más claros, para que el cuenco se lea aunque esté a oscuras.
- Las estrellas del cielo se colaban entre los asientos vistos desde arriba: un suelo oscuro bajo el estadio.
- La cámara pasaba a través de tu tarjeta al caer a la pista (una tarjeta gigante a medias): la tarjeta se apartó del
  paso de la cámara y, en la bajada de la frase 4, se apaga antes de que la cámara avance a la fila.
- Las tres luces de los cortes 1, 2 y 3 llegaban con la cámara aún moviéndose: ahora la cámara reposa 0,3 s antes y
  el parpadeo de las gradas se calma.
- El «sigue» del plano 7 al 10 saltaba: el 7 seguía dibujando las tres tarjetas y el 10 no. El 10 reutiliza la escena
  entera del 7 (`escena()`), y el resplandor del estadio desde el cielo entra con la subida, no de golpe.
- `f9.t("tú")` cogía el «tu» de «tu alcance» y la cámara daba un bandazo a la fila en «aguantó»: `f9.t("tu", 2)`.
- La tarjeta ganadora crecía hasta tapar la pantalla: crece un 15 % y se queda delante; en «eliges» es la misma que
  sube por encima de ti (y tú pasas a la pose del móvil en alto).
- 49-51 s («no lo deciden tus seguidores») quedaba casi negro: el banco se ve bajo la cortina.
- Huecos de sonido de más de 2 s: la fila encendida late, los móviles tiquean, el banco aplaude a oscuras, y la cámara
  lleva su aire al moverse.
- La portada: la primera fila encendida con «desconocidos» (el momento del hook), no el estadio a oscuras.

## Decisión del creador (25-oct-2026)

- Apertura: A (estadio). Es la que lleva el reel entregado; no hace falta re-render.
- Estilo de personaje: sin respuesta todavía; se mantiene A cartoon. Si pide B editorial: regenerar las 5 imágenes con el prompt B (~0,35 $), recortar, sustituir `video/img/*.png` y re-renderizar.
