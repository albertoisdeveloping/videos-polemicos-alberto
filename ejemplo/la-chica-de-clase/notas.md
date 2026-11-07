# La chica que nunca fue a clase: cómo se hizo

Reel TOFU para dueños de negocio que no publican, con una voz clonada de ElevenLabs. Lo que cuenta: el efecto de mera exposición
(Moreland y Beach 1992, las chicas en clase; Fang y otros 2007, los anuncios que no se miran), y que el que no publica
es la chica que nunca fue.

## Los tres hooks

| Hook | Por qué sí o no |
|---|---|
| «Una chica fue a clase quince veces sin hablar con nadie, y al final era la que mejor les caía a todos.» | Es una escena: no dice de qué va el vídeo ni le habla a quien mira (guion.md lo descarta). Se queda como segunda frase. |
| «¿Por qué hay que publicar aunque nadie te dé like?» | Dice el tema, pero es la idea obvia que el creador no quería: no sorprende, suena a consejo. |
| **«¿Sabías que cada vídeo tuyo que la gente pasa de largo hace que le caigas un poco mejor?»** | Elegido. Dice el tema con palabras de la calle, le habla a «tú», contradice lo que cree quien no publica (que si no lo ven, no sirve) y deja la pregunta abierta: ¿cómo va a funcionar algo que nadie mira? Se ve pasando desde el fotograma 0 (el feed a toda velocidad). |

El primer segundo se enseñó al creador en borrador y lo aprobó («si me gusta, sigue»): no se hizo la segunda apertura.

## Lo que se arregló al revisar

- La silueta de quien mira parecía un balón con rayas: se rehízo a contraluz, con halo y sin contorno de dibujo.
- Tu vídeo pasaba en dos fotogramas: ahora llega grande, se queda y sale hacia arriba como un scroll.
- Las chicas eran el doble de grandes que los alumnos de primera fila: se cambió la escala del aula (unos 130 alumnos,
  como en el estudio) y se bajaron los pupitres, que tapaban a las chicas sentadas.
- Las rayitas de la violeta se salían de la pizarra: van en dos filas de diez.
- La frase 4 es el mismo sitio que la 3: no se corta, sigue la misma cámara.
- 12-15 s casi quieto: la cámara va a cada chica cuando se nombra y la ilumina.
- 26-28 s sin cambios: las fotos suben en los cuatro «más» (también el de «cuantas más veces»).
- 23,5-25,6 s sin sonido ni movimiento: una luz recorre las cuatro fotos y ninguna se enciende más.
- El render iba a 0,4-0,9 s por fotograma: la estela del túnel se hace a media resolución y el fondo se dibuja una vez.

## Feedback del creador y lo que se hizo
- Subtítulos dinámicos y más dopamina: motor (`subtitulos: dinamico`, `video/efectos.js`) y capa de efectos.
- Música: «Succession» (Nicholas Britell) a -26 dB, con ducking por la voz
  (sidechaincompress 4:1) y loudnorm a -14 LUFS / -1 dBTP. Dos mp4 en salida/: con música y limpio (aquí solo va el limpio).
- Pendiente que se quedó así por decisión del creador: la portada corta «vídeo» a medias.
