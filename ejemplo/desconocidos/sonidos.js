// Los efectos: cada uno en lo que se mueve, en el fotograma en que se mueve (guia/sonido.md). Los momentos salen de
// los planos. «late» es el sello de tu vídeo (la tarjeta) y de cada fila que se enciende por ti.
import { v } from "#voz";
import { momentos as m1 } from "./video/planos/01-estadio.js";
import { momentos as m3 } from "./video/planos/03-ola.js";
import { momentos as m6 } from "./video/planos/06-largo.js";
import { momentos as m7 } from "./video/planos/07-prueba.js";
import { momentos as m10 } from "./video/planos/10-cielo.js";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
const f = (n) => v.frase(n);

// 1 · la caída al estadio, la tarjeta que sube, la fila que se enciende, tú y el banco
pon("empujon", 0, { ancla: "empieza", db: -9, vel: 0.7, que: "la cámara cae en picado desde el cielo" });
pon("aire", 0.9, { db: -13, vel: 0.6, que: "sigue cayendo" });
pon("sube", m1.subes + 0.05, { db: -10, que: "tu tarjeta sube de la pista" });
pon("late", m1.subes + 0.4, { db: -12, que: "tu tarjeta late" });
pon("golpe", m1.enciende + 0.04, { db: -8, que: "se enciende la primera fila" });
pon("clic", m1.enciende + 0.1, { db: -11, vel: 0.9, que: "chasquido de la luz" });
pon("empujon", m1.frena, { db: -11, vel: 1.1, que: "la cámara frena delante de ellos" });
[0, 1, 2, 3, 4, 5].forEach((i) => pon("tic", f(1).t("deciden") + 0.05 + i * 0.09, { db: -16 - (i % 2), lp: 6000, vel: 1 + i * 0.05, que: "los pulgares sobre el móvil" }));
pon("aire", m1.eleva, { ancla: "empieza", db: -12, vel: 0.55, que: "la cámara se eleva: todo lo que espera a oscuras" });
pon("aire", m1.baja, { ancla: "empieza", db: -12, vel: 0.7, que: "baja a la pista, hasta ti" });
[0, 1, 2, 3].forEach((i) => pon("tic", f(2).t("trescientas") + 0.02 + i * 0.11, { db: -14, que: "el contador corre a 300" }));
pon("clic", f(2).t("visitas") - 0.02, { db: -12, que: "300 visitas, clavado" });
pon("aire", m1.gira, { ancla: "empieza", db: -12, vel: 0.8, que: "la cámara gira al banco" });
pon("late", f(2).t("seguidores") + 0.1, { db: -12, que: "el banco naranja" });
pon("aire", m1.aleja, { ancla: "empieza", db: -11, vel: 0.5, que: "se aleja: el banco, diminuto" });
pon("aire", m1.apaga + 0.1, { db: -13, reves: true, vel: 0.9, que: "se apaga el banco" });

// los huecos: la fila encendida late mientras te miran; el banco; la cortina; el banco a oscuras
pon("late", f(1).t("desconocidos") + 0.5, { db: -13, que: "la fila encendida, mirándote" });
[0, 1, 2].forEach((i) => pon("tic", f(1).t("son") + i * 0.25, { db: -18, lp: 6000, que: "sus móviles" }));
pon("late", f(2).t("ellos") + 0.1, { db: -13, que: "el banco naranja late" });
pon("late", f(4).t("fila") + 0.35, { db: -13, que: "la fila encendida late" });
pon("aire", f(5).inicio + 0.1, { ancla: "empieza", db: -14, vel: 0.8, que: "la cámara se acerca a la fila" });
[0, 1, 2].forEach((i) => pon("toque", f(6).t("seguidores") + 0.3 + i * 0.38, { db: -19, vel: 0.9 + i * 0.05, que: "aplauden a oscuras" }));
pon("aire", f(9).t("seguidores") + 0.4, { db: -14, reves: true, vel: 0.8, que: "el banco, a oscuras" });
pon("aire", f(9).t("decide") + 0.1, { ancla: "empieza", db: -13, vel: 0.7, que: "la cámara se vuelve a la fila" });

// 3 · el cielo, el corro pequeño, la caída, la fila, la ola
pon("late", m3.late, { db: -11, que: "el borde del estadio late en «Instagram»" });
pon("sube", m3.sube + 0.05, { db: -11, que: "tu tarjeta sube" });
[0, 1, 2].forEach((i) => pon("clic", m3.corro + 0.05 + i * 0.09, { db: -12 - i, vel: 1 + i * 0.08, que: "se enciende el corro pequeño" }));
pon("late", m3.corro + 0.35, { db: -12, que: "el corro, encendido" });
m3.parpadea.forEach((t) => pon("clic", t, { db: -16, vel: 0.8, que: "el banco parpadea, apagado" }));
pon("empujon", m3.cae, { ancla: "empieza", db: -9, vel: 0.65, que: "la cámara cae a la pista" });
[0, 1, 2, 3].forEach((i) => pon("madera", m3.pasos + 0.12 + i * 0.2, { db: -19, vel: 1.4, lp: 5000, que: "tus pasos al salir a la pista" }));
pon("golpe", m3.enciende + 0.04, { db: -8, que: "se enciende la primera fila" });
pon("clic", m3.enciende + 0.1, { db: -11, vel: 0.9, que: "chasquido" });
[0, 1, 2, 3, 4, 5].forEach((i) => pon("tic", m3.barras + 0.1 + i * 0.1, { db: -15, lp: 6000, vel: 1 + i * 0.04, que: "las barritas se llenan" }));
pon("clic", f(5).t("entero") + 0.25, { db: -12, que: "hasta el final" });
[0, 1, 2, 3, 4, 5].forEach((i) => pon("sube", m3.envia + 0.05 + i * 0.06, { db: -14, vel: 1.15 + i * 0.05, que: "un avioncito de luz sale de un móvil" }));
m3.filas.forEach((t, i) => { pon("golpe", t + 0.12, { db: -10 + i, que: "se enciende la fila siguiente" }); pon("late", t + 0.3, { db: -13, que: "y late" }); });
pon("aire", m3.ola, { ancla: "empieza", db: -10, vel: 0.5, que: "la ola de luz sube por las gradas" });
pon("golpe-hondo", m3.lleno + 0.08, { db: -7, que: "el estadio entero, encendido" });
pon("canon", m3.lleno + 0.15, { db: -13, vel: 0.9, que: "el estadio retumba" });

// 6 · pasan de largo
m6.pasan.forEach((t, i) => pon("desliza", t + 0.04, { db: -14 - (i % 2), vel: 1.05 + i * 0.05, que: "uno pasa de largo con el pulgar" }));
pon("aire", m6.gira, { ancla: "empieza", db: -12, vel: 0.8, que: "la cámara gira a la pista" });
pon("aire", m6.apaga + 0.1, { db: -12, reves: true, vel: 0.8, que: "tu tarjeta se apaga" });
pon("clic", f(6).t("visitas") - 0.02, { db: -12, que: "300 visitas, clavado" });
pon("aire", m6.banco, { ancla: "empieza", db: -13, vel: 0.7, que: "la cámara sigue hasta el banco" });

// 7 · la prueba, las tres tarjetas, el día, la ganadora, la fila, tú eliges
pon("clic", m7.etiqueta + 0.1, { db: -12, que: "la etiqueta «Prueba»" });
pon("enganche", m7.interruptor + 0.15, { db: -10, que: "el interruptor se enciende" });
pon("late", m7.interruptor + 0.4, { db: -13, que: "y brilla" });
[0, 1, 2].forEach((i) => pon("clic", m7.corro + 0.05 + i * 0.09, { db: -12 - i, vel: 1 + i * 0.08, que: "se enciende el corro" }));
pon("aire", f(7).t("no") - 0.05, { ancla: "empieza", db: -13, vel: 0.8, que: "la cámara va al banco" });
pon("desliza", m7.cortina + 0.15, { db: -12, vel: 0.7, que: "baja la cortina sobre el banco" });
pon("muro", m7.cortina + 0.75, { db: -13, que: "la cortina se posa" });
m7.suben.forEach((t, i) => { pon("sube", t + 0.08, { db: -12, vel: 1 + i * 0.07, que: "sube una tarjeta" }); pon("clic", t + 0.45, { db: -14, que: "se para" }); });
pon("aire", m7.dia, { ancla: "empieza", db: -13, vel: 0.5, que: "pasa un día: amanece y anochece" });
pon("clic", m7.resultados + 0.3, { db: -12, que: "los resultados: una fila" });
pon("golpe", m7.resultados + 0.55, { db: -11, que: "cinco filas" });
pon("sube", m7.gana + 0.1, { db: -11, vel: 0.9, que: "la ganadora crece" });
pon("golpe", f(8).t("aguantó") + 0.1, { db: -10, que: "y se pone en el centro" });
pon("aire", m7.apagaBanco, { db: -14, reves: true, vel: 0.8, que: "el banco se apaga del todo" });
pon("golpe", m7.fila + 0.04, { db: -8, que: "se enciende la primera fila" });
pon("clic", m7.fila + 0.1, { db: -11, vel: 0.9, que: "chasquido" });
pon("sube", m7.alza + 0.05, { db: -10, que: "levantas la tarjeta ganadora" });
pon("golpe-hondo", m7.lleno + 0.1, { db: -7, que: "el estadio entero se enciende detrás de ti" });
pon("canon", m7.lleno + 0.2, { db: -13, vel: 0.9, que: "y retumba" });

// 10 · el cielo: tu estadio y el del amigo
pon("aire", m10.sube, { ancla: "empieza", db: -11, vel: 0.5, que: "la cámara sube al cielo" });
pon("aire", m10.otro, { ancla: "empieza", db: -13, vel: 0.6, que: "hasta el estadio del amigo" });
pon("clic", m10.nada + 0.15, { db: -13, vel: 0.8, que: "a oscuras: nada" });

export default e;
