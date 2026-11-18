import base64, json
from playwright.sync_api import sync_playwright
W, H = 1152, 3072
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"])
    pg = b.new_page(viewport={"width":W,"height":H})
    pg.on("console", lambda m: print("console:", m.text[:200]) if m.type=="error" else None)
    for noeud, cote in [("face_de_fente","fente"),("face_exterieure","ext")]:
        for mode in ["couleur","profondeur"]:
            pg.goto(f"http://localhost:5199/bake.html?w={W}&h={H}")
            pg.wait_for_function("document.title==='pret'")
            r = pg.evaluate(f"bake('{noeud}','{cote}','{mode}')")
            print(noeud, mode, r)
            data = pg.evaluate("document.getElementById('c').toDataURL('image/png')")
            open(f"bake_{cote}_{mode}.png","wb").write(base64.b64decode(data.split(",")[1]))
    b.close()
