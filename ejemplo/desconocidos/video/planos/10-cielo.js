// «Envíaselo a ese amigo que tiene un negocio y no publica nada.»
// La cámara sube al cielo: tu estadio encendido entero y, al lado, el de tu amigo: igual, pero a oscuras y vacío.
// Acaba sobre el estadio oscuro, como en el fotograma 0.
import * as k from "#kit";
import { v } from "#voz";
import * as M from "../mundo.js";
import { escena } from "./07-prueba.js";

const f10 = v.frase(10);
export const desde = () => f10.inicio;
export const entrada = "sigue";
const { suave: su, tramo: tr } = k;
const T = { env: f10.inicio, amigo: f10.t("amigo"), negocio: f10.t("negocio"), nada: f10.t("nada"), fin: f10.fin };
const OTRO = [2 * M.RADIO + 26, 0, 0];

export const cam = k.ruta([
  [T.env, { pos: [0, 7, 15], mira: [0, 4.5, -8] }],
  [T.amigo + 0.35, { pos: [22, 62, 34], mira: [28, 0, -5] }],
  [T.nada + 0.15, { pos: [OTRO[0], 125, 26], mira: [OTRO[0], 0, -3] }],
  [T.fin + 0.6, { pos: [OTRO[0], 125, 26], mira: [OTRO[0], 0, -3] }],
]);

export function dibuja(g, t) {
  const cm = cam(t);
  M.cielo(g);
  escena(g, cm, t, { glow: 1 - su(tr(t, T.env, T.amigo)) });
  M.estadio(g, cm, M.nada, { centro: OTRO, sinFila: true, detalle: 0.5 });
  const c = k.proyecta(cm, [0, 10, 0]);
  const alto = su(tr(t, T.env + 0.4, T.amigo + 0.3));   // el resplandor del estadio entero, solo cuando ya se ve desde arriba
  if (c && alto > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, c.x, c.y, k.tamano(M.RADIO * 2.4, c.z), M.AZUL, 0.3 * alto); g.restore(); }
}
export const momentos = { sube: T.env, otro: T.amigo, nada: T.nada };
