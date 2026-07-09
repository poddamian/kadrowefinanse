
## Kolejne kroki (w kolejności)

2. Napisać pozostałe 8 artykułów wg harmonogramu w `Plan artykulow blogowych.md` (druga runda satelitów klastrów A–D: #9–13, plus cały klaster E: #14–16). Aktualnie 8/16 gotowe — próg minimalny do AdSense (8–15) już osiągnięty, ale celuj w 12+ przed zgłoszeniem (patrz punkt 4).
3. Obserwować w GSC **Strony** (indeksowanie) i **Ulepszenia** (czy Google widzi schema.org — `WebApplication` na kalkulatorach, `BlogPosting` na artykułach) przez pierwsze 1–2 tygodnie po zgłoszeniu.
4. **Zgłoszenie do Google AdSense — kiedy najlepiej.** Poczekać 2–3 tygodnie od zgłoszenia domeny do GSC (2026-07-09) i zgłosić się, gdy spełnione są jednocześnie:
   - GSC pokazuje większość z 18 adresów jako zaindeksowane (zakładka **Strony**, bez błędów w **Ulepszenia**),
   - jest min. **12 artykułów** blogowych (nie tylko wymagane minimum 8) — więcej realnej treści podnosi szansę akceptacji za pierwszym razem,
   - strony zaufania (RODO, regulamin, kontakt, o nas) są kompletne — już gotowe.

   Zgłoszenie za wcześnie (przed indeksacją, przy tylko 8 artykułach) ryzykuje odrzucenie za "low value content", co kosztuje więcej czasu niż samo poczekanie.

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
