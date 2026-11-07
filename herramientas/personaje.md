# Un personaje recurrente de ejemplo y los dos estilos

El de `ejemplo/desconocidos/`: un dueño de negocio con delantal verde. Para el tuyo, cambia la descripción del
personaje y deja igual el resto del prompt (fondo, recorte, estilo).

Todas las imágenes se piden sobre fondo blanco liso, sin sombra en el suelo y sin texto, y se recortan con
`herramientas/recorta.py`. Modelo: `xai/grok-imagine-image-2.0`, 1K, `quality: medium`. Para mantener el personaje y el
estilo entre imágenes se pasa la url de la primera (la muestra elegida) en `image_urls`.

## El personaje recurrente: el dueño del negocio

Hombre de 38 años, pelo corto oscuro, barba de tres días, camisa vaquera remangada, delantal verde oscuro, pantalón
oscuro, botas marrones. Generado con la IA y recortado.

## Estilo A, cartoon premium (el que se usó)

```
Premium 2D cartoon illustration for a viral Instagram explainer, in the style of modern animated series: bold clean outlines, big expressive eyes, exaggerated readable expression, flat vivid colors with soft cel shading, rim light, polished and appealing character design. a 38-year-old Spanish small business owner, a man with short dark hair, light stubble, warm smile lines, wearing a rolled-sleeve denim shirt and a dark green apron over it, holding a smartphone in one hand and looking at it with a disappointed, puzzled face. Full body, standing, slightly turned three-quarter view. Single character, isolated on a flat solid pure white background, no shadow on the ground, no text, no logo, no props besides the phone, high contrast silhouette, clean edges for cutout.
```

## Estilo B, ilustración editorial (muestra en ejemplo/desconocidos/video/img/_muestra-B-editorial.png)

```
Editorial illustration, risograph and gouache feel: limited palette of deep navy, warm orange, cream and teal, visible paper grain texture, flat shapes with no outlines, slightly stylized elongated proportions, printed-poster look, sophisticated New Yorker style but friendly. a 38-year-old Spanish small business owner, a man with short dark hair, light stubble, warm smile lines, wearing a rolled-sleeve denim shirt and a dark green apron over it, holding a smartphone in one hand and looking at it with a disappointed, puzzled face. Full body, standing, slightly turned three-quarter view. Single character, isolated on a flat solid pure white background, no shadow on the ground, no text, no logo, no props besides the phone, high contrast silhouette, clean edges for cutout.
```

## Poses y grupos ya generados (con la muestra A como referencia de estilo)

- Caminando: `EXACTLY the same character as the reference image (same man, same face, short dark hair, light stubble, rolled-sleeve denim shirt, dark green apron, dark trousers, brown boots) in exactly the same premium 2D cartoon illustration style (bold clean outlines, big expressive eyes, flat vivid colors with soft cel shading). New pose: walking forward with a determined, hopeful expression, mid-stride, one hand holding the smartphone down at his side, the other arm swinging. Three-quarter view from the front-left. Full body, single character, isolated on a flat solid pure white background, no ground shadow, no text, clean cutout edges.`
- Con el móvil en alto: `EXACTLY the same character as the reference image (same man, same face, short dark hair, light stubble, rolled-sleeve denim shirt, dark green apron, dark trousers, brown boots) in exactly the same premium 2D cartoon illustration style (bold clean outlines, big expressive eyes, flat vivid colors with soft cel shading). New pose: standing facing the viewer, both arms raised high above his head holding the smartphone up with both hands like a trophy, screen facing forward, big proud triumphant smile, chest out. Full body, single character, isolated on a flat solid pure white background, no ground shadow, no text, clean cutout edges.`
- La primera fila de seis desconocidos (16:9): `Same premium 2D cartoon illustration style as the reference image (bold clean outlines, big expressive eyes, flat vivid colors with soft cel shading, polished appealing character design), but DIFFERENT people from the reference. The front row of a stadium audience at night: six diverse adults of different ages and ethnicities sitting side by side in dark stadium seats, seen from the front at eye level, each face lit from below and in front by the cool white-blue glow of the smartphone they hold, expressions curious and attentive, a couple of them slightly leaning forward. Only this one row, the six people fully visible from head to knees, evenly spaced, no gaps. Isolated on a flat solid pure white background, no stadium behind them, no text, clean cutout edges.`
- Los cuatro seguidores en el banco (4:3): `Same premium 2D cartoon illustration style as the reference image (bold clean outlines, big expressive eyes, flat vivid colors with soft cel shading, polished appealing character design), but DIFFERENT people from the reference. Four close friends sitting squeezed together on a small wooden bench, cheering and clapping happily, one holding a phone up, warm orange light on their faces, front view, full bodies visible. Isolated on a flat solid pure white background, no text, clean cutout edges.`
