#!/usr/bin/env node
// reparto.mjs: las frases de personaje con OTRA voz, montadas en la voz del locutor sin
// cortarle ni una palabra.
//
//   node motor/voz.mjs <proyecto>            primero la toma del locutor (solo sus frases)
//   node herramientas/reparto.mjs <proyecto> después: mete los personajes y rehace voz/voz.wav y voz/tiempos.json
//
// En guion.json, "personajes": [{ "despues": 1, "texto": "¡Oye, a veces surge algo!", "clave": "surge",
//   "voz": "tomkxGQGz4b1kE0EM722", "papel": "el paciente", "estabilidad": 0.3, "estilo": 0.6 }]
// «db» (opcional): sube o baja ese personaje frente al locutor (por defecto, el mismo nivel).
// «despues»: tras qué frase del locutor entra (su número en la toma del locutor). La toma del locutor se parte solo en
// el silencio que ya hay entre esa frase y la siguiente; el personaje entra en medio con un respiro antes y después.
// La frase del personaje pasa a ser una frase más (con "personaje": "el paciente") y las de después se renumeran, así
// que en el vídeo se cuentan todas seguidas. Cada toma de personaje se guarda (voz/personaje-N.json/.wav) y no se
// vuelve a pedir si su texto y su voz no cambian. Se puede ejecutar cuantas veces haga falta: parte siempre de la
// toma del locutor (voz/locutor.wav y voz/locutor-tiempos.json, que se guardan la primera vez).
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { argumentos, ayuda, carpetaProyecto, cargarClaves, escribirJson, escribirWav, fallo, ffmpeg, leerAudio, leerJson } from "../motor/lib/comun.mjs";

ayuda(`
node herramientas/reparto.mjs <proyecto>
Mete las frases de "personajes" de guion.json (cada una con su voz de ElevenLabs) en la voz del locutor, sin cortarla.
Ejecútalo siempre después de node motor/voz.mjs <proyecto>.
`);

const SR = 48000, RESPIRO = 0.22;
const { sueltos } = argumentos();
const dir = carpetaProyecto(sueltos[0]);
const guion = leerJson(join(dir, "guion.json"));
const pjs = guion.personajes || [];
if (!pjs.length) fallo("guion.json no tiene \"personajes\".");

// la toma del locutor: la primera vez se guarda aparte; si voz.mjs la ha rehecho, se vuelve a guardar
const fv = join(dir, "voz", "voz.wav"), ft = join(dir, "voz", "tiempos.json");
const fl = join(dir, "voz", "locutor.wav"), flt = join(dir, "voz", "locutor-tiempos.json");
const actual = leerJson(ft);
if (!actual.reparto) { copyFileSync(fv, fl); escribirJson(flt, actual); }
const loc = leerJson(flt), audioLoc = leerAudio(fl, SR);

// cada personaje: su toma (con sus tiempos), pedida una vez
cargarClaves();
const KEY = process.env.ELEVENLABS_API_KEY;
async function tomaDe(p, i) {
  const ajustes = { stability: p.estabilidad ?? 0.3, similarity_boost: p.similitud ?? 0.75, style: p.estilo ?? 0.55, speed: p.velocidad ?? 1, use_speaker_boost: true };
  const firma = createHash("sha1").update(JSON.stringify([p.voz, p.dicho || p.texto, ajustes, p.modelo || "eleven_v4"])).digest("hex").slice(0, 12);
  const fj = join(dir, "voz", `personaje-${i + 1}.json`), fw = join(dir, "voz", `personaje-${i + 1}.wav`);
  if (existsSync(fj) && existsSync(fw) && leerJson(fj).firma === firma) return { ...leerJson(fj), audio: leerAudio(fw, SR) };
  if (!KEY) fallo("No hay clave de ElevenLabs: node motor/clave.mjs");
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${p.voz}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST", headers: { "xi-api-key": KEY, "content-type": "application/json" },
    body: JSON.stringify({ text: p.dicho || p.texto, model_id: p.modelo || "eleven_v4", voice_settings: ajustes }),
  });
  if (!r.ok) fallo(`ElevenLabs dijo ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const j = await r.json(), mp3 = join(dir, "voz", `personaje-${i + 1}.mp3`);
  writeFileSync(mp3, Buffer.from(j.audio_base64, "base64"));
  ffmpeg(["-i", mp3, "-ar", String(SR), "-ac", "1", "-y", fw]);
  rmSync(mp3);
  const a = j.alignment || j.normalized_alignment, ws = [];
  let cur = null;
  a.characters.forEach((ch, k) => {
    if (/\s/.test(ch)) { if (cur) ws.push(cur); cur = null; return; }
    if (!cur) cur = { texto: "", inicio: a.character_start_times_seconds[k] };
    cur.texto += ch; cur.fin = a.character_end_times_seconds[k];
  });
  if (cur) ws.push(cur);
  const palabras = ws.filter((w) => w.texto.replace(/[^\p{L}\p{N}]/gu, "").length);
  escribirJson(fj, { firma, papel: p.papel, voz: p.voz, palabras });
  return { firma, palabras, audio: leerAudio(fw, SR) };
}

// montar: locutor hasta el final de su frase «despues» + mitad del silencio, el personaje, y el resto del locutor
const orden = pjs.map((p, i) => ({ p, i })).sort((a, b) => a.p.despues - b.p.despues);
const trozos = [], frases = [], palabras = [];
let desdeLoc = 0, desplaz = 0, n = 0, siguienteLoc = 1;
const pasaFrasesLoc = (hasta) => {
  for (; siguienteLoc <= hasta; siguienteLoc++) {
    const f = loc.frases[siguienteLoc - 1]; n++;
    frases.push({ ...f, n, inicio: f.inicio + desplaz, fin: f.fin + desplaz });
    for (const w of loc.palabras.filter((w) => w.frase === siguienteLoc)) palabras.push({ ...w, frase: n, inicio: w.inicio + desplaz, fin: w.fin + desplaz });
  }
};
for (const { p, i } of orden) {
  const f = loc.frases[p.despues - 1], sig = loc.frases[p.despues];
  if (!f || !sig) fallo(`El personaje ${i + 1} va después de la frase ${p.despues}, y la toma del locutor no tiene esa frase y una siguiente.`);
  const corte = (f.fin + sig.inicio) / 2;                     // en medio del silencio que ya hay entre las dos
  const toma = await tomaDe(p, i);
  pasaFrasesLoc(p.despues);
  trozos.push(audioLoc.subarray(Math.round(desdeLoc * SR), Math.round(corte * SR)));
  const inicioP = corte + desplaz + RESPIRO, w0 = toma.palabras[0].inicio, wN = toma.palabras[toma.palabras.length - 1].fin;
  const crudo = toma.audio.subarray(Math.max(0, Math.round((w0 - 0.04) * SR)), Math.min(toma.audio.length, Math.round((wN + 0.12) * SR)));
  // al mismo nivel que el locutor (energía de lo que suena, sin contar los silencios), con un tope para no saturar
  const gan = Math.min(4, nivel(audioLoc) / (nivel(crudo) || 1)) * Math.pow(10, (p.db ?? 0) / 20);
  let pico = 0; for (const x of crudo) pico = Math.max(pico, Math.abs(x));
  const k = Math.min(gan, 0.95 / (pico || 1)), clip = crudo.map((x) => x * k);
  trozos.push(new Float32Array(Math.round(RESPIRO * SR)), clip, new Float32Array(Math.round(RESPIRO * SR)));
  n++;
  const escritas = p.texto.split(/\s+/).filter((w) => w.replace(/[^\p{L}\p{N}]/gu, "").length);
  const pw = toma.palabras.map((w, k) => ({ texto: escritas[k] ?? w.texto, inicio: r3(inicioP + w.inicio - w0 + 0.04), fin: r3(inicioP + w.fin - w0 + 0.04), frase: n, clave: escritas[k] && limpia(escritas[k]) === limpia(p.clave || "") }));
  frases.push({ n, texto: p.texto, clave: p.clave, personaje: p.papel || "personaje", inicio: pw[0].inicio, fin: pw[pw.length - 1].fin });
  palabras.push(...pw);
  const dur = RESPIRO * 2 + clip.length / SR;
  desdeLoc = corte; desplaz += dur;
}
pasaFrasesLoc(loc.frases.length);
trozos.push(audioLoc.subarray(Math.round(desdeLoc * SR)));
const total = trozos.reduce((s, x) => s + x.length, 0), mono = new Float32Array(total);
let o = 0; for (const x of trozos) { mono.set(x, o); o += x.length; }
escribirWav(fv, mono, SR);
escribirJson(ft, { ...loc, reparto: true, duracion: r3(total / SR), frases, palabras });
console.log(`voz con reparto: ${fv} (${(total / SR).toFixed(2)} s)`);
for (const f of frases) console.log(`${String(f.n).padStart(2)} ${f.inicio.toFixed(2).padStart(6)}–${f.fin.toFixed(2).padEnd(6)} ${f.personaje ? `[${f.personaje}] ` : ""}${f.texto}`);

function nivel(a) {
  let s = 0, n = 0;
  for (let i = 0; i < a.length; i += 4) { const x = a[i]; if (Math.abs(x) > 0.02) { s += x * x; n++; } }
  return Math.sqrt(s / (n || 1));
}
function r3(x) { return Math.round(x * 1000) / 1000; }
function limpia(s) { return String(s).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, ""); }
