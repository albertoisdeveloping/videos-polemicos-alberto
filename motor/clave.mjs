#!/usr/bin/env node
// clave.mjs: abre una página en este ordenador para pegar una clave. La guarda en .env.local y se cierra.
// La clave nunca pasa por el chat ni sale del ordenador.
//   node motor/clave.mjs              la de la voz (ElevenLabs)
//   node motor/clave.mjs higgsfield   la de las imágenes de IA (Higgsfield), opcional
import { spawn } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { join } from "node:path";
import { RAIZ } from "./lib/comun.mjs";

const ENV = join(RAIZ, ".env.local");
const CLAVES = {
  voz: { nombre: "ElevenLabs", var: "ELEVENLABS_API_KEY", ok: /^sk_[A-Za-z0-9]{20,}$/, pista: "Empieza por <code>sk_</code>.",
    donde: "La sacas en elevenlabs.io → tu perfil → API Keys.", mal: "Esa no parece la clave: empieza por sk_ y es larga.", ph: "sk_..." },
  higgsfield: { nombre: "Higgsfield", var: "HIGGSFIELD_API_KEY", ok: /^[A-Za-z0-9:_\-]{20,}$/, pista: "",
    donde: "La sacas en cloud.higgsfield.ai → API Keys (si te da id y secreto, pégalos juntos así: <code>id:secreto</code>).",
    mal: "Esa no parece la clave: es larga y sin espacios.", ph: "..." },
};
const C = CLAVES[process.argv[2] || "voz"];
if (!C) { console.error(`uso: node motor/clave.mjs [${Object.keys(CLAVES).join("|")}]`); process.exit(64); }
const pagina = (msg = "") => `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>Tu clave de ${C.nombre}</title><style>body{font:18px/1.5 system-ui;max-width:560px;margin:60px auto;padding:0 16px;color:#111}
input{width:100%;font:16px monospace;padding:12px;border:1px solid #bbb;border-radius:8px;box-sizing:border-box}button{margin-top:14px;font:600 16px system-ui;padding:12px 20px;border:0;border-radius:8px;background:#111;color:#fff}
.ok{color:#127a3a}</style><h1>Tu clave de ${C.nombre}</h1><p>Pégala aquí, no en el chat. ${C.pista} Se guarda solo en este ordenador.
${C.donde}</p>
<form method="post"><input name="k" placeholder="${C.ph}" autocomplete="off" spellcheck="false" autofocus><button>Guardar</button></form><p>${msg}</p></html>`;

const srv = createServer((req, res) => {
  if (req.method !== "POST") { res.writeHead(200, { "content-type": "text/html; charset=utf-8" }); return res.end(pagina()); }
  let b = "";
  req.on("data", (c) => (b += c));
  req.on("end", () => {
    const k = new URLSearchParams(b).get("k")?.trim() || "";
    if (!C.ok.test(k)) { res.writeHead(200, { "content-type": "text/html; charset=utf-8" }); return res.end(pagina(C.mal)); }
    const antes = existsSync(ENV) ? readFileSync(ENV, "utf8").split(/\r?\n/).filter((l) => l && !l.startsWith(`${C.var}=`)) : [];
    writeFileSync(ENV, [...antes, `${C.var}=${k}`].join("\n") + "\n");
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(pagina('<span class="ok">Guardada. Ya puedes cerrar esta pestaña y volver al chat.</span>'));
    console.log("clave guardada en .env.local");
    setTimeout(() => process.exit(0), 300);
  });
});
srv.listen(0, "127.0.0.1", () => {
  const url = `http://127.0.0.1:${srv.address().port}/`;
  console.log(`página de la clave: ${url}`);
  const abrir = process.platform === "win32" ? ["cmd", ["/c", "start", "", url]] : process.platform === "darwin" ? ["open", [url]] : ["xdg-open", [url]];
  spawn(abrir[0], abrir[1], { detached: true, stdio: "ignore" }).unref();
});
setTimeout(() => { console.log("la página se cerró sin clave (10 min)"); process.exit(1); }, 10 * 60 * 1000);
