
## Kolejne kroki (w kolejności)

1. Zgłosić domenę do Google Search Console — instrukcja krok po kroku w `INSTRUKCJA-GOOGLE-SEARCH-CONSOLE.md` (weryfikacja TXT w DNS, zgłoszenie sitemapy, ręczne zaindeksowanie kluczowych stron).
2. Napisać pozostałe 8 artykułów wg harmonogramu w `Plan artykulow blogowych.md` (druga runda satelitów klastrów A–D: #9–13, plus cały klaster E: #14–16). Aktualnie 8/16 gotowe — próg minimalny do AdSense (8–15) już osiągnięty.
3. Po zgłoszeniu do GSC: obserwować **Strony** (indeksowanie) i **Ulepszenia** (czy Google widzi schema.org — `WebApplication` na kalkulatorach, `BlogPosting` na artykułach) przez pierwsze 1–2 tygodnie.
4. Dopiero po tym: zgłoszenie do Google AdSense.

## Jak wznowić pracę lokalnie

```
cd "D:\Moje dokumenty\APLIKACJE\DO ADSENSE\kalkulatory"
npm run dev
```

Otwórz http://localhost:4321

## Deploy

Automatyczny — wystarczy zwykły push:

```
git add -A
git commit -m "opis zmiany"
git push
```

Cloudflare Workers Builds sam buduje (`npm run build`) i wdraża (`npx wrangler deploy`) na `kadrowefinanse.pl` przy każdym pushu na `master`. Postęp builda widać w dashboardzie: Workers & Pages → `kadrowefinanse` → Deployments.

Ręczny deploy (awaryjnie, gdy trzeba wdrożyć bez czekania na build w chmurze) nadal możliwy:

```
npm run build
npx wrangler deploy
```

Wymaga zmiennej środowiskowej `CLOUDFLARE_API_TOKEN` z uprawnieniami do konta i strefy `kadrowefinanse.pl`.
