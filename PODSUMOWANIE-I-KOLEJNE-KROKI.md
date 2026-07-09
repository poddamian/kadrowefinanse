# KadroweFinanse — podsumowanie stanu i kolejne kroki

Zaktualizowano 2026-07-09: strona działa pod https://kadrowefinanse.pl i https://www.kadrowefinanse.pl (Cloudflare Pages, projekt `kadrowefinanse`, deploy typu direct upload — patrz "Deploy" niżej). Poczta na domenie (MX/IMAP/SMTP) nie została ruszona i nadal działa.

## Status wdrożenia

- Projekt Cloudflare Pages **`kadrowefinanse`** utworzony w koncie `Poddamian@gmail.com's Account`.
- Custom domains `kadrowefinanse.pl` i `www.kadrowefinanse.pl` podpięte i aktywne (status `active`, certyfikat SSL wystawiony).
- Rekordy DNS apex i `www` zmienione z A (stary hosting lh.pl) na CNAME → `kadrowefinanse.pages.dev`, proxy przez Cloudflare. Pozostałe rekordy pocztowe (MX, `mail.`/`imap.`/`smtp.`/`pop3.`, SPF) nie zostały zmienione.
- **Deploy jest na razie ręczny (direct upload przez `wrangler pages deploy dist`), NIE jest jeszcze podłączony do GitHub** — `git push` sam z siebie NIE aktualizuje strony. Żeby to zmienić, trzeba w dashboardzie Cloudflare Pages → projekt `kadrowefinanse` → Settings → Builds & deployments połączyć z repo `poddamian/kadrowefinanse` (branch `master`, build `npm run build`, output `dist`), co przełączy projekt na automatyczne deploye przy pushu.

## Co jest gotowe

### 4 kalkulatory (w pełni działające, testowane)
- `/b2b-czy-uop/` — porównanie netto etat vs B2B (skala/liniowy/ryczałt × 3 warianty ZUS)
- `/nadplata-kredytu/` — symulacja nadpłaty kredytu (skrócenie okresu / zmniejszenie raty)
- `/ekwiwalent-za-urlop/` — ekwiwalent za niewykorzystany urlop
- `/skladka-zdrowotna/` — porównanie składki zdrowotnej między formami opodatkowania

Silnik obliczeniowy (`src/lib/podatki.ts`) ma 26 testów regresji (`npm run test:calc`) — wszystkie przechodzą, wartości zweryfikowane ręcznie.

### 4 strony zaufania
- `/o-nas/`
- `/kontakt/` — e-mail `kontakt@kadrowefinanse.pl`
- `/polityka-prywatnosci/`
- `/regulamin/`

### Design system
Papierowa "księga rachunkowa": zieleń butelkowa + bursztyn, Manrope + IBM Plex Mono. Progress indicator w kalkulatorach, touch targety min. 44px, kontrast WCAG AA/AAA.

## Plan artykułów

Pełny plan **16 artykułów** (5 klastrów, keywords, harmonogram 2026-07-14 do 2026-10-27) — patrz `Plan artykulow blogowych.md` w katalogu nadrzędnym `DO ADSENSE`.

**Napisane (4/16):**
1. `/blog/b2b-czy-umowa-o-prace-2026/` (2026-07-08, przed terminem)
2. `/blog/skladka-zdrowotna-2026-przewodnik/` (2026-07-09, przed terminem)
3. `/blog/nadplata-kredytu-hipotecznego-okres-czy-rata/` (2026-07-09, przed terminem)
4. `/blog/ekwiwalent-za-urlop-jak-liczyc/` (2026-07-09, przed terminem)

Wszystkie 4 pillar artykuły klastrów A–D gotowe — każdy linkuje wzajemnie ze swoim kalkulatorem. Strona listy `/blog/` zaktualizowana.

## Kolejne kroki (w kolejności)

1. **Podłączyć Cloudflare Pages do GitHub** (dashboard → projekt `kadrowefinanse` → Settings → Builds & deployments), żeby `git push` automatycznie deployował — na razie trzeba ręcznie `wrangler pages deploy dist`.
2. Napisać pozostałe 12 artykułów wg harmonogramu w `Plan artykulow blogowych.md` (satelity klastrów A–D + klaster E).
3. Sitemap, schema.org (structured data kalkulatorów), Google Search Console.
4. Dopiero po tym: zgłoszenie do Google AdSense.

## Jak wznowić pracę lokalnie

```
cd "D:\Moje dokumenty\APLIKACJE\DO ADSENSE\kalkulatory"
npm run dev
```

Otwórz http://localhost:4321

## Deploy

Dopóki GitHub nie jest podłączony (patrz punkt 1 wyżej), deploy jest ręczny:

```
npm run build
npx wrangler pages deploy dist --project-name kadrowefinanse --branch master
```

Wymaga zmiennej środowiskowej `CLOUDFLARE_API_TOKEN` (uprawnienia: Account → Cloudflare Pages: Edit, Zone → DNS: Edit, Zone → Zone: Read, zakres: konto + strefa `kadrowefinanse.pl`).

Warto też commitować do gita niezależnie od deployu, żeby historia była spójna:

```
git add -A
git commit -m "opis zmiany"
git push
```
