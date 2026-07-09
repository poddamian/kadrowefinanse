# KadroweFinanse — podsumowanie stanu i kolejne kroki

Data: 2026-07-07 (zaktualizowano 2026-07-08: zmiana nazwy z PoliczTo na KadroweFinanse, wybrano domenę kadrowefinanse.pl)

## Co jest gotowe

### 4 kalkulatory (w pełni działające, testowane)
- `/b2b-czy-uop/` — porównanie netto etat vs B2B (skala/liniowy/ryczałt × 3 warianty ZUS)
- `/nadplata-kredytu/` — symulacja nadpłaty kredytu (skrócenie okresu / zmniejszenie raty)
- `/ekwiwalent-za-urlop/` — ekwiwalent za niewykorzystany urlop
- `/skladka-zdrowotna/` — porównanie składki zdrowotnej między formami opodatkowania

Silnik obliczeniowy (`src/lib/podatki.ts`) ma 26 testów regresji (`npm run test:calc`) — wszystkie przechodzą, wartości zweryfikowane ręcznie.

### 4 strony zaufania (gotowe, wymagają jednej poprawki)
- `/o-nas/`
- `/kontakt/` — ✅ e-mail zaktualizowany na `kontakt@kadrowefinanse.pl` (zakłada, że skrzynka na tej domenie zostanie utworzona po zakupie)
- `/polityka-prywatnosci/`
- `/regulamin/`

### Design system
Papierowa "księga rachunkowa": zieleń butelkowa + bursztyn, Manrope + IBM Plex Mono. Przeprowadzony audyt UX/UI (frontend-design + ui-ux-pro-max):
- Dodano progress indicator do wszystkich 4 kalkulatorów (pasek postępu wypełniania formularza)
- Naprawiono touch targety (segmenty, przełącznik chorobowe) do min. 44px
- Naprawiono animację progress bara (transform zamiast width — wydajność)
- Kontrast kolorów zweryfikowany matematycznie (WCAG AA/AAA spełnione)

## Plan artykułów

Zaktualizowano 2026-07-08: pełny plan **16 artykułów** (5 klastrów tematycznych, keywords, harmonogram publikacji 2026-07-14 do 2026-10-27) — patrz plik `Plan artykulow blogowych.md` w katalogu nadrzędnym `DO ADSENSE`. Ta sekcja z 4 artykułami jest nieaktualna, zastąpiona tamtym planem.

**Artykuł #1 napisany 2026-07-08** (przed terminem 2026-07-14): `/blog/b2b-czy-umowa-o-prace-2026/` — case study z wykresem SVG, linkuje wzajemnie z `/b2b-czy-uop/`. Strona listy `/blog/` gotowa, link w stopce dodany.

## Otwarte pytania / decyzje do podjęcia jutro

1. ~~**E-mail kontaktowy**~~ — ✅ ustalony: `kontakt@kadrowefinanse.pl`
2. ~~**Architektura artykułów**~~ — ✅ zdecydowane: zwykłe strony `.astro` w `src/pages/blog/` (routing `/blog/nazwa-artykulu/`), bez content collections — spójnie z resztą serwisu.
3. ~~**Domena**~~ — ✅ wybrana: **kadrowefinanse.pl** (2026-07-08)
4. **Hosting** — Cloudflare Pages (rekomendacja, darmowy) — czy zaczynamy `git init` i podłączenie?

## Kolejne kroki (w kolejności)

1. Napisać pozostałe 15 artykułów wg harmonogramu w `Plan artykulow blogowych.md` (artykuł #1 gotowy)
2. `git init` + repozytorium + Cloudflare Pages
3. Sitemap, schema.org (structured data dla kalkulatorów), Google Search Console
4. Dopiero po tym: zgłoszenie do Google AdSense

## Jak wznowić pracę lokalnie

```
cd "D:\Moje dokumenty\APLIKACJE\DO ADSENSE\kalkulatory"
npm run dev
```

Otwórz http://localhost:4321
