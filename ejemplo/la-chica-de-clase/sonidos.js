// Los efectos: cada uno en lo que se mueve, en el fotograma en que se mueve (mira guia/sonido.md).
// Los momentos salen de los planos; «late» es el sello de tu vídeo y de lo que le vas sonando.
import { v } from "#voz";
import { momentos as feed } from "./video/planos/01-feed.js";
import { momentos as aula } from "./video/planos/02-aula.js";
import { momentos as fotos } from "./video/planos/03-fotos.js";
import { momentos as anuncio } from "./video/planos/04-anuncio.js";
import { momentos as movil } from "./video/planos/05-movil.js";
import { momentos as calle } from "./video/planos/06-calle.js";
import { momentos as fin } from "./video/planos/07-final.js";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });

// 1 · el feed: vuelo entre vídeos, tu vídeo que llega y sale disparado, el frenazo y el calor
pon("empujon", 0, { ancla: "empieza", db: -9, vel: 0.8, que: "arranca el vuelo por el feed" });
pon("aire", 0.75, { db: -13, vel: 0.9, que: "pasan vídeos cerca" });
feed.llegadas.forEach((t, i) => pon("aire", t + 0.12, { db: -11, vel: 1.1 - i * 0.1, que: "llega tu vídeo" }));
feed.salidas.forEach((t) => pon("sube", t + 0.12, { db: -11, que: "tu vídeo sale hacia arriba (scroll)" }));
pon("empujon", feed.para, { db: -10, vel: 1.1, que: "frena el vuelo y se queda tu vídeo" });
pon("late", feed.calor + 0.1, { db: -10, que: "el naranja le llena" });

// 2 · el aula: la puerta, las chicas que llegan, las rayitas de tiza, se sientan, la cámara se aleja y se acerca
pon("madera", aula.puerta + 0.1, { db: -13, que: "se abre la puerta" });
pon("aire", v.frase(2).t("cuatro") + 0.3, { db: -14, vel: 0.6, que: "la cámara baja hacia la tarima" });
for (const [sale, llega] of aula.pasos) for (let t = sale + 0.25; t < llega - 0.1; t += 0.42) pon("madera", t, { db: -21, vel: 1.5, lp: 5000, que: "pasos en la tarima" });
aula.pasos.forEach(([, llega], i) => pon("clic", llega, { db: -16 - (i % 2), vel: 1 + i * 0.05, que: "una chica se para en su sitio" }));
pon("aire", aula.nunca - 0.1, { db: -14, reves: true, que: "la coral se apaga" });
aula.rayas.forEach((lista) => lista && lista.forEach((t, j) => pon("tic", t, { db: -15 - (j % 2), lp: 6000, vel: 1 + (j % 3) * 0.06, que: "una rayita de tiza" })));
pon("aire", v.frase(4).inicio + 0.05, { db: -14, vel: 0.9, que: "bajan de la tarima" });
pon("madera", aula.sientan, { db: -13, que: "se sientan" });
pon("aire", aula.aleja, { db: -12, vel: 0.6, que: "la cámara se aleja: el aula entera" });
pon("aire", aula.acerca, { db: -13, vel: 0.8, que: "la cámara se acerca a ellas" });
pon("papel", aula.acerca + 0.45, { db: -15, que: "escriben en la libreta" });
pon("madera", aula.levantan + 0.05, { db: -14, vel: 1.1, que: "se levantan y se van" });

// 3 · las fotos: caen, barritas iguales, toman color y suben en cada «más»
fotos.caidas.forEach((t, i) => pon("papel", t + 0.3, { db: -11 - (i % 2), vel: 1 + i * 0.04, que: "cae una foto" }));
pon("clic", fotos.flash - 0.03, { db: -10, vel: 0.8, que: "el flash de la cámara de fotos" });
pon("clic", fotos.iguales + 0.35, { db: -14, que: "las cuatro barritas, iguales" });
pon("aire", fotos.barre, { ancla: "empieza", db: -14, vel: 0.7, que: "la luz recorre las fotos" });
fotos.caidas.forEach((t, i) => pon("toque", fotos.barre + 0.25 + i * 0.27, { db: -19, vel: 0.9, que: "la luz pasa por una foto" }));
pon("sube", fotos.color + 0.05, { db: -14, que: "las barritas toman su color" });
fotos.mas.forEach((t, i) => pon("sube", t + 0.2, { db: -12 + i, vel: 1 + i * 0.08, que: "suben las fotos" }));
fotos.mas.forEach((t) => pon("clic", t + 0.4, { db: -15, que: "se paran" }));

// 4 · el anuncio: va y viene en la esquina, gusta, la tablet se apaga
anuncio.turnos.forEach((t, i) => pon("toque", t + 0.05, { db: -15 - (i % 2), vel: 1 + (i % 3) * 0.05, que: "cambia el anuncio de la esquina" }));
pon("late", anuncio.gusta + 0.2, { db: -11, que: "el anuncio de limonada brilla" });
pon("aire", anuncio.apaga, { db: -12, reves: true, vel: 0.8, que: "se apaga la tablet" });

// 5 · el móvil: cada scroll y, cada vez que se va tu vídeo, el sello
movil.scrolls.forEach((t, i) => pon("desliza", t + 0.05, { db: -16 - (i % 2), vel: 1 + (i % 3) * 0.05, que: "scroll" }));
movil.pasaTuyo.forEach((t, i) => pon("late", t + 0.25, { db: -12 + i, que: "se enciende un poco más su cabeza" }));

// 6 · la calle: el viaje, el frenazo y tu tienda que se enciende
pon("aire", calle.viaje + 0.25, { ancla: "empieza", db: -11, vel: 0.5, que: "la cámara viaja por la calle" });
pon("empujon", calle.frena - 0.05, { db: -13, vel: 1.2, que: "frena delante de tu tienda" });
pon("golpe", calle.enciende + 0.05, { db: -11, que: "se enciende tu tienda" });
pon("late", calle.enciende + 0.15, { db: -12, que: "y su cabeza" });

// 7 · el final: el foco, la foto gris, la cámara que se aleja y se apaga el aula
pon("golpe-hondo", fin.foco + 0.05, { db: -10, que: "cae el foco sobre el sitio vacío" });
pon("papel", fin.posaFoto + 0.33, { db: -12, que: "se posa la foto gris" });
pon("aire", v.frase(10).t("nunca") - 0.1, { db: -15, vel: 0.6, que: "la cámara se acerca al sitio vacío" });
pon("clic", v.frase(10).t("clase") + 0.05, { db: -16, que: "se queda quieto el sitio vacío" });
pon("aire", fin.aleja, { ancla: "empieza", db: -12, vel: 0.5, que: "la cámara se aleja hasta ver el aula" });
pon("aire", fin.aleja + 1.5, { ancla: "empieza", db: -15, vel: 0.45, que: "sigue alejándose" });
pon("golpe-hondo", fin.oscurece + 0.3, { db: -12, lp: 1400, que: "se apaga el aula y queda el hueco" });

export default e;
