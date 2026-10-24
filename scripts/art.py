import sys, colorsys
from PIL import Image, ImageFilter
src, dst = sys.argv[1], sys.argv[2]
pairs = {"1.jpg":"sangeet","2.jpg":"wedding","3.jpg":"mehendi"}
for f, name in pairs.items():
    im = Image.open(f"{src}/{f}").convert("RGB")
    w,h = im.size
    # web hero: max 1400px on the long side
    s = 1400/max(w,h)
    hero = im.resize((round(w*s), round(h*s)), Image.LANCZOS) if s<1 else im
    hero.save(f"{dst}/{name}.jpg", quality=82, optimize=True, progressive=True)
    # soft background wash: small, blurred, for the page background
    wash = im.resize((48, round(48*h/w)), Image.LANCZOS).filter(ImageFilter.GaussianBlur(3)).resize((480, round(480*h/w)), Image.BICUBIC)
    wash.save(f"{dst}/{name}-wash.jpg", quality=70, optimize=True)
    # palette candidates
    q = im.resize((200, round(200*h/w))).quantize(colors=10, method=Image.Quantize.MEDIANCUT).convert("RGB")
    cols = sorted(q.getcolors(200*200*2), reverse=True)
    out=[]
    for n,(r,g,b) in cols:
        hh,l,ss = colorsys.rgb_to_hls(r/255,g/255,b/255)
        out.append(f"#{r:02x}{g:02x}{b:02x} share={n/sum(c[0] for c in cols):.2f} L={l:.2f} S={ss:.2f} H={hh*360:.0f}")
    print(name, hero.size); print("\n".join("  "+o for o in out))
