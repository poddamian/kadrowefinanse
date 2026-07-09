/**
 * Testy regresji silnika obliczeniowego — wartości kontrolne policzone ręcznie
 * dla stawek 2026. URUCHAMIAJ PO KAŻDEJ ZMIANIE params2026.ts: npm run test:calc
 * (po zmianie stawek zaktualizuj wartości oczekiwane wraz z komentarzami).
 */
import { uopNetto, b2bNetto, ekwiwalent, symulujNadplate, zusSpoleczneMies } from '../src/lib/podatki';

let bledy = 0;
function sprawdz(nazwa: string, otrzymane: number, oczekiwane: number, tolerancja = 1) {
  const ok = Math.abs(otrzymane - oczekiwane) <= tolerancja;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${nazwa}: ${otrzymane} (oczekiwane ~${oczekiwane})`);
  if (!ok) bledy++;
}

// ── UoP 10 000 brutto (2026) ──
// społeczne 13,71% = 1371; zdrowotna 9%×8629 = 776,61
// PIT rocznie: 12%×(120000−16452−3000)−3600 = 8465,76 → 705,48/mies; netto ≈ 7146,91
const u = uopNetto(10000);
sprawdz('UoP 10000: społeczne', u.spoleczneMies, 1371, 0.5);
sprawdz('UoP 10000: zdrowotna', u.zdrowotnaMies, 776.61, 0.5);
sprawdz('UoP 10000: PIT', u.pitMies, 705.5, 1);
sprawdz('UoP 10000: netto', u.nettoMies, 7146.9, 2);

// ── UoP płaca minimalna 4806 ──
sprawdz('UoP 4806: netto', uopNetto(4806).nettoMies, 3606, 3);

// ── ZUS przedsiębiorcy 2026 ──
// duży z chorobowym + FP: 5652 × 34,09% = 1926,77
sprawdz('ZUS duży + chorobowe', zusSpoleczneMies('duzy', true), 1926.77, 0.1);
// preferencyjny bez FP, z chorobowym: 1441,80 × 31,64% = 456,19
sprawdz('ZUS preferencyjny', zusSpoleczneMies('preferencyjny', true), 456.19, 0.5);
sprawdz('ZUS ulga na start', zusSpoleczneMies('ulgaNaStart', true), 0, 0);

// ── B2B liniowy 12 000, koszty 500, duży ZUS ──
// dochód rok 114 878,76; zdrowotna 4,9% → 469,09/mies; podatek 19% po odliczeniu → 1729,79/mies
const b = b2bNetto({ przychodMies: 12000, kosztyMies: 500, forma: 'liniowy', zus: 'duzy', chorobowe: true });
sprawdz('B2B liniowy: zdrowotna', b.zdrowotnaMies, 469.09, 0.5);
sprawdz('B2B liniowy: podatek', b.podatekMies, 1729.79, 1);
sprawdz('B2B liniowy: netto', b.nettoMies, 7374.35, 2);

// ── B2B ryczałt 12% (IT), 144 000/rok → próg do 300k, zdrowotna 830,58 ──
const r = b2bNetto({ przychodMies: 12000, kosztyMies: 500, forma: 'ryczalt', stawkaRyczaltu: 0.12, zus: 'duzy', chorobowe: true });
sprawdz('B2B ryczałt 12%: zdrowotna', r.zdrowotnaMies, 830.58, 0.1);
sprawdz('B2B ryczałt 12%: podatek', r.podatekMies, 1158.95, 1);
sprawdz('B2B ryczałt 12%: netto', r.nettoMies, 7583.7, 2);

// ── B2B skala: minimalna zdrowotna przy niskim dochodzie ──
const s = b2bNetto({ przychodMies: 3000, kosztyMies: 2500, forma: 'skala', zus: 'ulgaNaStart', chorobowe: false });
sprawdz('B2B skala niski dochód: zdrowotna = minimalna', s.zdrowotnaMies, 432.54, 0.1);

// ── Ekwiwalent 8000 zł, 10 dni: 8000/20,92=382,41; /8=47,80; ×80h=3824,09 ──
const e = ekwiwalent(8000, 10, 1);
sprawdz('Ekwiwalent: dzienna', e.stawkaDzienna, 382.41, 0.05);
sprawdz('Ekwiwalent: godzinowa', e.stawkaGodzinowa, 47.8, 0.05);
sprawdz('Ekwiwalent: kwota', e.ekwiwalentBrutto, 3824, 1);
sprawdz('Ekwiwalent 1/2 etatu: współczynnik', ekwiwalent(4000, 5, 0.5).wspolczynnik, 10.46, 0.01);

// ── Kredyt 400 000, 7,2%, 25 lat: rata ≈ 2878,35 ──
const k0 = symulujNadplate({ kapital: 400000, oprocentowanie: 0.072, okresMies: 300, nadplataMies: 0, nadplataJednorazowa: 0, tryb: 'okres' });
sprawdz('Kredyt: rata bazowa', k0.rataBazowa, 2878.45, 1);
sprawdz('Kredyt bez nadpłat: okres bez zmian', k0.okresZMies, 300, 0);
sprawdz('Kredyt bez nadpłat: oszczędność 0', k0.oszczednosc, 0, 1);

// ── Nadpłata 500/mies (tryb okres): niezależnie n = 207,2 → skrócenie 92; oszczędność ~163,5k ──
const k1 = symulujNadplate({ kapital: 400000, oprocentowanie: 0.072, okresMies: 300, nadplataMies: 500, nadplataJednorazowa: 0, tryb: 'okres' });
sprawdz('Nadpłata 500: skrócenie (mies.)', k1.skrocenieMies, 92, 2);
sprawdz('Nadpłata 500: oszczędność', k1.oszczednosc, 163500, 1500);

// ── Tryb 'rata': mniejsza oszczędność niż 'okres'; rata po nadpłacie sensowna ──
const k2 = symulujNadplate({ kapital: 400000, oprocentowanie: 0.072, okresMies: 300, nadplataMies: 500, nadplataJednorazowa: 0, tryb: 'rata' });
if (k2.oszczednosc >= k1.oszczednosc) { console.log('FAIL: tryb rata nie może oszczędzać więcej niż skrócenie okresu'); bledy++; }
if (k2.rataPoNadplacie <= 0 || k2.rataPoNadplacie >= k1.rataBazowa) { console.log('FAIL: rata po nadpłacie poza zakresem'); bledy++; }

// ── Jednorazowa 50 000 (tryb rata): nowa rata = annuitet(350 000) ≈ 2518,6 ──
const k3 = symulujNadplate({ kapital: 400000, oprocentowanie: 0.072, okresMies: 300, nadplataMies: 0, nadplataJednorazowa: 50000, tryb: 'rata' });
sprawdz('Jednorazowa 50k: nowa rata', k3.rataPoNadplacie, 2518.6, 2);

console.log(bledy === 0 ? '\nWSZYSTKIE TESTY OK' : `\nBŁĘDY: ${bledy}`);
process.exit(bledy === 0 ? 0 : 1);
