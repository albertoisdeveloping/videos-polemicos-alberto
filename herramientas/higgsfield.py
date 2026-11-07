#!/usr/bin/env python3
"""Higgsfield (clave HIGGSFIELD_API_KEY en .env.local de la carpeta, nunca se imprime; la guarda `node motor/clave.mjs higgsfield`): estima, genera y
descarga imágenes, y apunta cada gasto en ia/gasto.json de la carpeta desde la que se ejecuta (el proyecto del reel).
Tope duro: 2 $ por reel (TOPE); si una imagen lo pasa, no se genera.
  cd proyectos/<reel> && python3 ../../herramientas/higgsfield.py estimate <modelo> '<json body>'
  ... higgsfield.py gen <nombre> <modelo> '<json body>'     -> ia/out/<nombre>.png + ia/gasto.json
  ... higgsfield.py gastado
Modelo probado: xai/grok-imagine-image-2.0, body {"prompt","resolution":"1k","aspect_ratio":"3:4","quality":"medium",
"image_urls":[<url de una imagen ya generada, para mantener el estilo o el personaje>]}: 0,06 $ (0,07 con referencia).
"""
import json, os, sys, time, urllib.request
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def _clave():
    if os.environ.get('HIGGSFIELD_API_KEY'): return os.environ['HIGGSFIELD_API_KEY'].strip()
    env = os.path.join(RAIZ, '.env.local')
    if os.path.exists(env):
        for l in open(env, encoding='utf-8'):
            if l.startswith('HIGGSFIELD_API_KEY='): return l.split('=', 1)[1].strip()
    sys.exit('Falta la clave de Higgsfield: node motor/clave.mjs higgsfield')

KEY = _clave()
H = {"Authorization": f"Key {KEY}", "User-Agent": "curl/8.7.1", "Accept": "application/json", "Content-Type": "application/json"}
API = "https://api.higgsfield.ai"
HERE = os.path.join(os.getcwd(), 'ia')
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
GASTO = os.path.join(HERE, 'gasto.json')
TOPE = 2.00

def call(method, url, body=None):
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body is not None else None, headers=H, method=method)
    try:
        r = urllib.request.urlopen(req, timeout=60); return r.status, json.loads(r.read().decode() or '{}')
    except urllib.error.HTTPError as e:
        return e.code, {'error': e.read().decode()[:400]}

def gastado():
    return sum(x['usd'] for x in json.load(open(GASTO))) if os.path.exists(GASTO) else 0.0

def apunta(reg):
    l = json.load(open(GASTO)) if os.path.exists(GASTO) else []
    l.append(reg); json.dump(l, open(GASTO, 'w'), indent=1, ensure_ascii=False)

def estimate(model, body):
    return call('POST', f"{API}/estimate/{model}", body)

def gen(nombre, model, body):
    s, e = estimate(model, body)
    if s != 200: print('estimate falló', s, e); sys.exit(1)
    usd = float(e['usd'])
    if gastado() + usd > TOPE: print(f'TOPE: gastado {gastado():.3f} + {usd:.3f} > {TOPE}'); sys.exit(2)
    s, r = call('POST', f"{API}/{model}", body)
    if s not in (200, 201, 202): print('envío falló', s, r); sys.exit(1)
    apunta({'nombre': nombre, 'modelo': model, 'usd': usd, 'credits': e.get('credits'), 'request_id': r.get('request_id'), 't': time.strftime('%Y-%m-%d %H:%M:%S'), 'body': {k: v for k, v in body.items() if k != 'image_urls'}, 'refs': len(body.get('image_urls', []))})
    st = r['status_url']
    for i in range(90):
        time.sleep(3)
        s, q = call('GET', st)
        est = q.get('status')
        if est in ('completed', 'succeeded', 'success'):
            imgs = q.get('images') or q.get('output') or q.get('image') or q
            url = None
            if isinstance(imgs, list) and imgs: url = imgs[0].get('url') if isinstance(imgs[0], dict) else imgs[0]
            elif isinstance(imgs, dict): url = imgs.get('url')
            if not url: print('sin url en', json.dumps(q)[:600]); sys.exit(1)
            ext = '.png' if '.png' in url.split('?')[0] else ('.webp' if '.webp' in url.split('?')[0] else '.jpg')
            p = os.path.join(HERE, 'out', nombre + ext)
            urllib.request.urlretrieve(url, p) if False else open(p, 'wb').write(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'curl/8.7.1'})).read())
            l=json.load(open(GASTO)); [x.update({'url':url,'fichero':p}) for x in l if x.get('request_id')==r.get('request_id')]; json.dump(l,open(GASTO,'w'),indent=1,ensure_ascii=False)
            print('ok', p, f'{usd:.3f} $', f'total {gastado():.3f} $'); return p
        if est in ('failed', 'error', 'cancelled', 'nsfw'):
            print('falló', json.dumps(q)[:600]); sys.exit(1)
    print('tiempo agotado'); sys.exit(1)

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'estimate': print(estimate(sys.argv[2], json.loads(sys.argv[3])))
    elif cmd == 'gen': gen(sys.argv[2], sys.argv[3], json.loads(sys.argv[4]))
    elif cmd == 'gastado': print(f'{gastado():.3f} $')
    elif cmd == 'url':
        s_, q = call('GET', f"{API}/requests/{sys.argv[2]}/status"); print(json.dumps(q)[:800])
