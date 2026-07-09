# Jak zgłosić kadrowefinanse.pl do Google Search Console

Przygotowane pod stronę już wdrożoną na `https://kadrowefinanse.pl` z gotową sitemapą
(`https://kadrowefinanse.pl/sitemap-index.xml`) i danymi strukturalnymi schema.org.

## 1. Dodaj usługę (property)

1. Wejdź na **https://search.google.com/search-console** i zaloguj się kontem Google
   powiązanym z `poddamian@gmail.com` (albo dowolnym, którym chcesz zarządzać serwisem).
2. Kliknij **Dodaj usługę** (Add property).
3. Zobaczysz dwie opcje — wybierz **Domena** (Domain), nie „Prefiks adresu URL":
   - Domena obejmuje automatycznie `https://`, `http://`, `www.` i bez `www.` w jednym miejscu.
   - Wpisz samą domenę: `kadrowefinanse.pl` (bez `https://`, bez `www.`).

## 2. Zweryfikuj własność domeny (rekord DNS TXT)

Przy opcji „Domena" Google prosi o dodanie rekordu TXT w DNS — to jedyna metoda weryfikacji
dla tej opcji (nie plik HTML, bo weryfikacja obejmuje całą domenę, nie jeden serwer).

1. Google pokaże wartość w formacie: `google-site-verification=xxxxxxxxxxxxxxxxxxxxxxxx`.
2. Skopiuj ją.
3. Wejdź do Cloudflare → **kadrowefinanse.pl → DNS → Records** → **Add record**:
   - Type: `TXT`
   - Name: `@` (czyli sama domena `kadrowefinanse.pl`)
   - Content: wklejona wartość z Google (cały ciąg `google-site-verification=...`)
   - TTL: Auto
4. Zapisz rekord.
5. Wróć do Google Search Console i kliknij **Weryfikuj** (Verify) — zwykle działa od razu,
   czasem trzeba poczekać kilka minut na propagację DNS.

> Nie usuwaj tego rekordu TXT po weryfikacji — Google okresowo go sprawdza, żeby potwierdzić
> dalsze prawo własności do domeny.

## 3. Zgłoś sitemapę

1. W lewym menu Search Console: **Sitemapy** (Sitemaps).
2. W polu „Dodaj nową sitemapę" wpisz: `sitemap-index.xml`
   (Search Console sam doda `https://kadrowefinanse.pl/` z przodu).
3. Kliknij **Wyślij** (Submit).
4. Status powinien zmienić się na „Powodzenie" (Success) w ciągu kilku minut do godziny —
   sitemapa zawiera obecnie 18 adresów URL (strona główna, 4 kalkulatory, 8 artykułów blogowych,
   4 strony zaufania, listing bloga).

## 4. Sprawdź indeksowanie kluczowych stron

1. W górnym pasku wyszukiwania Search Console wklej pojedynczy URL, np.
   `https://kadrowefinanse.pl/b2b-czy-uop/`, i naciśnij Enter — to narzędzie **Kontrola adresu
   URL** (URL Inspection).
2. Jeśli strona nie jest jeszcze zaindeksowana, kliknij **Poproś o zaindeksowanie** (Request
   indexing). Warto to zrobić ręcznie dla strony głównej i 4 kalkulatorów, żeby przyspieszyć
   pierwsze wejście do indeksu — nie trzeba tego robić dla każdego z 18 adresów, sitemapa
   wystarczy dla reszty.
3. To samo narzędzie pokaże, czy Google widzi dane strukturalne (schema.org) ze strony —
   sekcja „Ulepszenia" (Enhancements) będzie z czasem pokazywać wykryte typy: `WebApplication`
   (4 kalkulatory), `BlogPosting` (8 artykułów), `Organization` (każda strona).

## 5. Monitoring po zgłoszeniu

- **Wydajność** (Performance) — pokaże się z opóźnieniem 2–3 dni; śledzi wyświetlenia, kliknięcia,
  CTR i pozycje dla fraz, na które strona się pojawia.
- **Strony** (Pages, dawniej Coverage) — pokazuje, które URL-e są zaindeksowane, a które
  wykluczone i dlaczego (przydatne do wychwycenia błędów w kolejnych tygodniach).
- **Podstawowe wskaźniki internetowe** (Core Web Vitals) — będzie zbierać dane po tym, jak
  strona zacznie mieć realny ruch; zwykle wypełnia się dopiero po kilku tygodniach.

## 6. (Opcjonalnie, ale zalecane) Połącz z Google Analytics / Bing Webmaster Tools

- Jeśli w przyszłości dodasz Google Analytics 4, można go połączyć bezpośrednio z Search
  Console w **Ustawienia → Skojarzenia** (Settings → Associations) dla wspólnych raportów.
- Warto też zgłosić tę samą sitemapę w **Bing Webmaster Tools**
  (https://www.bing.com/webmasters) — Bing pozwala zaimportować usługę bezpośrednio z Google
  Search Console jednym kliknięciem, więc to dosłownie 2 minuty dodatkowej pracy po kroku 1–3.

---

**Kolejność w praktyce:** wykonaj kroki 1–4 od razu po pierwszym wdrożeniu istotnej treści
(już spełnione — 8 artykułów blogowych i 4 kalkulatory są live). Nie czekaj na wszystkie
16 artykułów z planu — im wcześniej Google zacznie indeksować, tym szybciej strona zacznie
zbierać dane rankingowe.
