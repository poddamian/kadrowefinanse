# KadroweFinanse — podsumowanie stanu i kolejne kroki

Zaktualizowano 2026-07-09: strona działa pod https://kadrowefinanse.pl i https://www.kadrowefinanse.pl, obsługiwana przez **Cloudflare Worker `kadrowefinanse`** (statyczny hosting, auto-deploy z GitHub). Poczta na domenie (MX/IMAP/SMTP) nie została ruszona i nadal działa.

## Status wdrożenia

- Zasób **Worker `kadrowefinanse`** (Workers & Pages → Compute) podłączony do repo `poddamian/kadrowefinanse`, branch `master`. Build: `npm run build`, deploy: `npx wrangler deploy` (auto-detect static assets z `dist/`, bez adaptera SSR — strona jest w 100% statyczna/client-side).
- **Auto-deploy działa** — każdy `git push` na `master` automatycznie buduje i wdraża stronę (Cloudflare Workers Builds). Nie trzeba już ręcznego `wrangler pages deploy`.
- Custom domains `kadrowefinanse.pl` i `www.kadrowefinanse.pl` podpięte bezpośrednio pod ten Worker (zakładka Domains).
- Historia: początkowo strona była wdrożona jako osobny projekt **Cloudflare Pages** (direct upload). Po podłączeniu GitHub w dashboardzie Cloudflare utworzyło **nowy, osobny zasób Worker** o tej samej nazwie zamiast połączyć się z istniejącym Pages — dlatego auto-deploy z początku nie aktualizował żywej domeny. Naprawione 2026-07-09: domenę przepięto z Pages na Worker, stary projekt Pages usunięty.
- Bot Cloudflare otworzył PR proponujący adapter `@astrojs/cloudflare` (SSR) — **zamknięty bez mergowania**, bo niepotrzebny dla w pełni statycznej strony.

## Co jest gotowe

### 4 kalkulatory (w pełni działające, testowane)
- `/b2b-czy-uop/` — porównanie netto etat vs B2B (skala/liniowy/ryczałt × 3 warianty ZUS)
- `/nadplata-kredytu/` — symulacja nadpłaty kredytu (skrócenie okresu / zmniejszenie raty)
- `/ekwiwalent-za-urlop/` — ekwiwalent za niewykorzystany urlop
- `/skladka-zdrowotna/` — porównanie składki zdrowotnej między formami opodatkowania

Silnik obliczeniowy (`src/lib/podatki.ts`) ma 26 testów regresji (`npm run test:calc`) — wszystkie przechodzą, wartości zweryfikowane ręcznie. Formularze startują puste (placeholdery), wynik pokazuje „—" dopóki dane nie są wpisane.

### 4 strony zaufania
- `/o-nas/`
- `/kontakt/` — e-mail `kontakt@kadrowefinanse.pl`
- `/polityka-prywatnosci/`
- `/regulamin/`

### Design system
Papierowa "księga rachunkowa": zieleń butelkowa + bursztyn, Manrope + IBM Plex Mono. Logo w headerze, przyciski-zakładki w nawigacji, progress indicator w kalkulatorach, touch targety min. 44px, kontrast WCAG AA/AAA.

## Plan artykułów

Pełny plan **16 artykułów** (5 klastrów, keywords, harmonogram 2026-07-14 do 2026-10-27) — patrz `Plan artykulow blogowych.md` w katalogu nadrzędnym `DO ADSENSE`.

**Napisane (4/16):**
1. `/blog/b2b-czy-umowa-o-prace-2026/` (2026-07-08, przed terminem)
2. `/blog/skladka-zdrowotna-2026-przewodnik/` (2026-07-09, przed terminem)
3. `/blog/nadplata-kredytu-hipotecznego-okres-czy-rata/` (2026-07-09, przed terminem)
4. `/blog/ekwiwalent-za-urlop-jak-liczyc/` (2026-07-09, przed terminem)

Wszystkie 4 pillar artykuły klastrów A–D gotowe — każdy linkuje wzajemnie ze swoim kalkulatorem. Strona listy `/blog/` zaktualizowana.

## Kolejne kroki (w kolejności)

1. Napisać pozostałe 12 artykułów wg harmonogramu w `Plan artykulow blogowych.md` (satelity klastrów A–D + klaster E).
2. Sitemap, schema.org (structured data kalkulatorów), Google Search Console.
3. Dopiero po tym: zgłoszenie do Google AdSense.

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

Wymaga zmiennej środowiskowej `CLOUDFLARE_API_TOKEN` z uprawnieniami do kontа i strefy `kadrowefinanse.pl`.
