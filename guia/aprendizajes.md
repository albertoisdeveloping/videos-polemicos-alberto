# Aprendizajes (de los primeros vídeos hechos con este método, oct-2026)

Léelo junto con METODO.md antes de cada vídeo. Lo que diga `preferencias.md` del creador manda sobre esto.

## El estándar de todos los vídeos (salvo que el creador diga otra cosa)
- **Subtítulos dinámicos:** `"subtitulos": "dinamico"` en guion.json y `subtitulo(t, bloque, plano)` en
  `video/efectos.js`. Cambian de sitio y tamaño según la escena y la clave entra grande, de su color. El sitio se decide
  **por bloque** (`b.palabras[0].inicio`), nunca por el segundo actual: si no, salta a mitad de frase.
- **Dopamina:** `video/efectos.js` (el motor lo carga solo si existe) con `camara(t)`: golpe de zoom en cada clave,
  temblor sacado de los sonidos de impacto y transición de zoom con desenfoque en cada corte. `encima(g, t, plano)`:
  chispas en cada clave, cifras que saltan (solo con fuente), grano y viñeta. Partir de `ejemplo/la-chica-de-clase/video/efectos.js`.
- **Música** debajo de la voz (si el creador quiere): una canción que él tenga o elija. Entregar
  siempre dos mp4: con música (ducking + loudnorm a -14 LUFS / -1 dBTP) y limpio, para poner la canción desde
  Instagram al publicar (son canciones comerciales). La receta: `herramientas/mezcla.sh`.
- Lo dibujado solo a mano puede quedar «muy básico». Si el creador tiene clave de Higgsfield: la IA de imagen solo para
  personajes y elementos sueltos, con un tope de 2 $ por reel; si no hay clave o no cabe, todo con el motor y más
  creatividad.

## Del motor
- El motor deja el audio en ~-21 LUFS: normalizar siempre a -14 en la mezcla final.
- El render final a 60 fps tarda ~15-20 min en el Mac (7 hilos) y el borrador ~4,5 min. Lo caro es `shadowBlur` en
  muchas piezas, los fondos con `brillo` grandes por fotograma (precalcúlalos en un lienzo) y las estelas a resolución
  completa (hazlas a media).
- `ver.mjs` sin subtítulos no ve los choques de texto: revisa también con ellos (`frases`, a 390 px).
- Las palabras de `v.t()` van sin tildes: «Envíaselo» es `"enviaselo"`.
- Una constante usada antes de declararse (`const X`) rompe la carga del plano sin dar el error en `ver.mjs ... | tail`:
  mira la salida entera.

## Del dibujo
- Escala: las personas de la tarima y los alumnos de primera fila deben medir lo mismo; si no, se ven muñecos.
- Un primer plano de algo pequeño (sentadas en una fila) necesita zoom 1,6-1,8: a 2,2 se pierde el resto.
- Textura con `multiply` sobre un lienzo transparente pinta un rectángulo: recorta antes (`clip`).
- Siluetas a contraluz: relleno casi negro + halo con `shadowBlur` del color de la luz; nada de rayas ni contornos.
- Retratos en fotos: encuadra cabeza y hombros midiendo dónde cae la cabeza en el lienzo de la figura.
- Lo de una escena que dura más de 1 s sin moverse lo marca `revisar.mjs`: arréglalo con algo que pase con la voz
  (la cámara va a lo que se nombra, una luz que recorre, un escalón por cada «más»).

## Del proceso
- Bajar reels de IG sin sesión: Playwright guardando todas las pistas (vídeo y audio van separados) y uniéndolas con
  ffmpeg; yt-dlp no sirve con IG.
- Coste orientativo: primer vídeo ~23-28 $ de API (5-6 $ de eso, el feedback); los siguientes ~8-12 $ y 1,5-2 h;
  ElevenLabs ~0,30 $ por vídeo.

# El estilo híbrido (`ejemplo/desconocidos/`)

Los personajes y los elementos sueltos los genera la IA de imagen (Higgsfield) y todo lo demás (mundo, cámara, luz,
efectos, subtítulos, sonido) lo hace el motor. Tope duro: 2 $ de Higgsfield por reel. Las herramientas están en
`herramientas/` (su LEEME dice cómo se usan) y un personaje recurrente de ejemplo con sus prompts en `herramientas/personaje.md`.

## Pedir imágenes a la IA
- Primero `estimate`, luego `gen`: `xai/grok-imagine-image-2.0` a 1K cuesta 0,06 $ por imagen (0,07 con referencia).
  El reel entero salió por 0,40 $ (6 imágenes). Soul (`higgsfield-ai/soul/standard`) solo acepta 720p/1080p y cuesta
  0,094 $. nano-banana y seedream no existen en esa API.
- Dos muestras de estilo del mismo personaje (A cartoon premium, B editorial) y se elige con el creador antes de generar
  en serie. Luego cada imagen nueva lleva en `image_urls` la url de la muestra elegida y en el prompt «EXACTLY the same
  character as the reference image» (mismo personaje) o «same style, DIFFERENT people» (otros). Así el dueño sale igual
  en tres poses y la fila y los amigos comparten dibujo sin ser él.
- Siempre sobre fondo blanco liso, sin sombra en el suelo y sin texto, y una sola pieza por imagen: la de la fila de
  seis fue la única que costó encajar porque es un grupo (se corta en seis trozos en el motor para encender a cada uno).
- Recortar en local: `herramientas/recorta.py` hace transparente solo el blanco pegado al borde (los ojos y los
  dientes se quedan), contrae un píxel y quita el halo. No hace falta rembg.
- Las versiones a oscuras de un recorte se hacen en el motor pintando negro con `source-atop` sobre el dibujo, no se
  piden a la IA.
- Las imágenes se cargan una vez con `await loadImage` al principio de `mundo.js`, y el origen de cada una va en
  notas.md (modelo, tamaño, fecha, si llevó referencia).
- Las generaciones en paralelo pisan el fichero de gasto: una detrás de otra.

## Un mundo para todo el reel
- Lo que más subió el nivel fue tener UN concepto visual (el estadio a oscuras donde las filas se encienden) y que
  cada frase sea un rincón de ese mundo, escrito antes en plan.md. La cámara viaja; nada de una escena por frase.
- Un mundo en 3D con el motor: miles de asientos se precalculan una vez (posición, fila, ángulo), se dibujan de lejos a
  cerca y con sprites pregenerados (apagado/encendido); así los 6.563 asientos caben en un fotograma a 60 fps.
- Un suelo oscuro bajo el mundo: si no, las estrellas se cuelan entre los asientos cuando la cámara mira desde arriba.
  Y el relleno de pantalla entera solo cuando la cámara está dentro del cuenco, o tapa al segundo estadio.
- Lo apagado también tiene que verse: siluetas azul noche con borde de luz, una línea tenue por fila y los puntos
  lejanos un poco más claros. Negro sobre negro no es «a oscuras», es nada.
- La cámara no puede atravesar las cosas: al caer en picado, el final del descenso se deja a z=5 y la tarjeta fuera del
  paso. Un objeto que la cámara va a cruzar se apaga antes.
- El ganador que «crece» crece un 15 % y se queda delante, no hasta tapar la pantalla.

## Cámara y cortes
- Antes de cada corte la cámara reposa 0,3 s (dos claves iguales) y el parpadeo de las luces se calma: si el corte
  llega con la cámara en marcha, se ve como un salto.
- Un plano que «sigue» al anterior tiene que dibujar exactamente la misma escena en su primer fotograma: el plano 7
  exporta `escena(g, cm, t, op)` y el 10 la reutiliza, en vez de copiar las piezas. Los resplandores que el plano nuevo
  añade entran en fundido, no de golpe.
- `v.frase(n).t("tú")` no distingue tildes y coge el primer «tu» de la frase: si la clave se repite, `t("tu", 2)`.
- El informe de render lista «saltos sueltos»: la mayoría son cambios de bloque de subtítulo o fogonazos buscados, pero
  hay que mirarlos uno a uno con `ver.mjs`. En este reel dos eran de verdad (el «sigue» del 7 al 10 y el bandazo del «tu»).
- Un tramo que se queda casi negro (49-51 s) se nota en el móvil más que en la hoja: subir el suelo de luz de lo que
  debe verse (el banco bajo la cortina).

## Voz, música y entrega
- Una voz de ElevenLabs a ritmo normal va a unas 3,15 palabras por segundo: 185 palabras son 58,7 s. Más de 185 y se pasa de los 60 s
  (la primera toma, de 193, salió a 62 s y hubo que recortar y volver a generar: ~0,3 $ cada toma).
- La canción se mide en local con ffmpeg (volumen por segundo) para saber dónde está su subidón. El subidón se coloca en la palabra fuerte del reel
  entrando en la canción con adelanto (`mezcla.sh ... <desde_s>`): en este, 1,1 s para que caiga en «llenar».
- Música a -24 dB bajo la voz con ducking 4:1 y loudnorm final a -14 LUFS / -1 dBTP en las dos versiones.
- Render final a 60 fps: 8 min con 7 hilos (más rápido que el primero porque las piezas pesadas van precalculadas).
- Las dos aperturas se entregan como mp4 cortos del hook (borrador de los primeros 13 s) junto a las dos muestras de
  estilo, en `~/Desktop/reel-<nombre>/`, y el reel completo con la opción A para no esperar.
