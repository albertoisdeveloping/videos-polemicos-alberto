# Reels explicativos

Reels verticales dibujados y animados, con voz, subtítulos dinámicos, efectos y sonido. Le das una idea a tu IA
(«hazme un vídeo de por qué el cielo es azul») y te devuelve el vídeo listo para publicar, con portada y texto del post.
Todo se hace en tu ordenador; nada se publica solo.

Mira el nivel en `ejemplo/`: cuatro reels hechos con este método, con su mp4, su guion y cada plano en código.

| Ejemplo | Qué enseña |
|---|---|
| `estrella-verde/` | un mundo por el que viaja la cámara |
| `alcohol/` | una escena por idea, con cosas de casa |
| `la-chica-de-clase/` | subtítulos dinámicos y capa de efectos (zoom, temblor, chispas, transiciones) |
| `desconocidos/` | estilo híbrido: personajes generados con IA de imagen dentro de un mundo dibujado por el motor |

## Cómo empezar

1. Descarga la carpeta (botón verde **Code → Download ZIP**, o `git clone`) y descomprímela.
2. Ábrela en la app de escritorio de **Claude** (pestaña Code → Select folder) o de **ChatGPT** (Codex → Local).
3. Escribe **«configúrame»**. Tu IA instala lo que falta (Node, ffmpeg, `npm install`), te pregunta idioma, público y
   cierre, y te abre una página para pegar tu clave de **ElevenLabs** (la voz). La clave se pega en esa página, nunca
   en el chat, y se queda en `.env.local` en tu ordenador.
4. Pide tu vídeo con tus palabras. Sale en `salida/`.

Los pasos con dibujos: abre `EMPIEZA-AQUI.html` en el navegador.

## Qué necesitas

- Claude (app de escritorio, plan con Claude Code) o ChatGPT con Codex.
- Una cuenta de [ElevenLabs](https://elevenlabs.io) con clave de API (sin «Restrict Key»). ~0,30 $ de voz por vídeo.
- Opcional: una clave de [Higgsfield](https://higgsfield.ai) para el estilo híbrido (personajes con IA, tope de 2 $
  por reel). Se pone con `node motor/clave.mjs higgsfield`. Sin ella, todo lo dibuja el motor.
- Opcional: Python 3 con `numpy` y `pillow` para recortar imágenes y validar el vídeo (la IA lo instala si hace falta).

## La voz

Los guiones de los ejemplos llevan la voz con la que se hicieron, que no es tuya. En `configúrame` dile a tu IA qué voz
de ElevenLabs quieres (una de la biblioteca o tu propia voz clonada) y la guarda en `preferencias.md`.

## La carpeta

```
AGENTS.md        las reglas que lee tu IA (CLAUDE.md apunta aquí)
METODO.md        cómo se hace un vídeo, paso a paso
guia/            guion, dibujo, sonido y aprendizajes de los primeros vídeos
motor/           render, voz, sonido, revisión y el kit de dibujo
herramientas/    estilo híbrido y entrega: imágenes IA, recorte, reparto de voces, música, validación
sonidos/         efectos de sonido aprobados
ejemplo/         los cuatro reels de referencia
proyectos/       tus vídeos (no se suben a git)
salida/          tus vídeos terminados (no se suben a git)
```

`preferencias.md`, `.env.local`, `proyectos/` y `salida/` son tuyos y están en `.gitignore`.
