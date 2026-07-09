/**
 * Silnik obliczeniowy — czyste funkcje, bez DOM.
 * Wszystkie kwoty wejściowe/wyjściowe w zł. Obliczenia w ujęciu ROCZNYM
 * (poprawne przekraczanie progu PIT), wyniki prezentowane miesięcznie.
 */
import {
  PIT,
  UOP,
  ZUS_DUZY_PODSTAWA,
  ZUS_PREF_PODSTAWA,
  ZUS_STAWKI,
  ZDROWOTNA,
  LIMIT_30_KROTNOSCI,
  WSPOLCZYNNIK_URLOPOWY,
  NORMA_DOBOWA,
} from './params2026';

const round2 = (x: number) => Math.round(x * 100) / 100;

/** Roczny podatek wg skali 12/32 z kwotą zmniejszającą. */
export function pitSkala(podstawaRoczna: number): number {
  if (podstawaRoczna <= 0) return 0;
  const podatek =
    podstawaRoczna <= PIT.prog
      ? podstawaRoczna * PIT.stawka1
      : PIT.prog * PIT.stawka1 + (podstawaRoczna - PIT.prog) * PIT.stawka2;
  return Math.max(0, podatek - PIT.kwotaZmniejszajaca);
}

// ─── Umowa o pracę ─────────────────────────────────────────────────────

export interface WynikUoP {
  bruttoMies: number;
  spoleczneMies: number;
  zdrowotnaMies: number;
  pitMies: number;
  nettoMies: number;
  /** Rozbicie składek społecznych */
  emerytalna: number;
  rentowa: number;
  chorobowa: number;
}

/** Netto z umowy o pracę (średnia miesięczna z rozliczenia rocznego). */
export function uopNetto(bruttoMies: number, kupMies = UOP.kupStandard): WynikUoP {
  const bruttoRok = bruttoMies * 12;

  // Limit 30-krotności dotyczy tylko emerytalnej i rentowej
  const podstawaER = Math.min(bruttoRok, LIMIT_30_KROTNOSCI);
  const emerytalna = podstawaER * UOP.emerytalna;
  const rentowa = podstawaER * UOP.rentowa;
  const chorobowa = bruttoRok * UOP.chorobowa;
  const spoleczne = emerytalna + rentowa + chorobowa;

  const zdrowotna = (bruttoRok - spoleczne) * UOP.zdrowotna;
  const podstawaPit = Math.max(0, Math.round(bruttoRok - spoleczne - kupMies * 12));
  const pit = Math.round(pitSkala(podstawaPit));
  const netto = bruttoRok - spoleczne - zdrowotna - pit;

  return {
    bruttoMies: round2(bruttoMies),
    spoleczneMies: round2(spoleczne / 12),
    zdrowotnaMies: round2(zdrowotna / 12),
    pitMies: round2(pit / 12),
    nettoMies: round2(netto / 12),
    emerytalna: round2(emerytalna / 12),
    rentowa: round2(rentowa / 12),
    chorobowa: round2(chorobowa / 12),
  };
}

// ─── JDG / B2B ─────────────────────────────────────────────────────────

export type FormaOpodatkowania = 'skala' | 'liniowy' | 'ryczalt';
export type WariantZus = 'duzy' | 'preferencyjny' | 'ulgaNaStart';

export interface OpcjeB2B {
  /** Przychód netto na fakturze, zł/mies. */
  przychodMies: number;
  /** Koszty uzyskania (bez ZUS), zł/mies. */
  kosztyMies: number;
  forma: FormaOpodatkowania;
  /** Stawka ryczałtu (np. 0.12) — wymagana dla formy 'ryczalt' */
  stawkaRyczaltu?: number;
  zus: WariantZus;
  /** Czy opłaca dobrowolną składkę chorobową */
  chorobowe: boolean;
}

export interface WynikB2B {
  przychodMies: number;
  kosztyMies: number;
  zusSpoleczneMies: number;
  zdrowotnaMies: number;
  podatekMies: number;
  nettoMies: number;
  dochodMies: number;
  efektywnaStopa: number; // % przychodu oddawany państwu
}

/** Miesięczne składki społeczne JDG dla wariantu ZUS. */
export function zusSpoleczneMies(zus: WariantZus, chorobowe: boolean): number {
  if (zus === 'ulgaNaStart') return 0;
  const podstawa = zus === 'duzy' ? ZUS_DUZY_PODSTAWA : ZUS_PREF_PODSTAWA;
  let suma =
    podstawa * (ZUS_STAWKI.emerytalna + ZUS_STAWKI.rentowa + ZUS_STAWKI.wypadkowa);
  if (chorobowe) suma += podstawa * ZUS_STAWKI.chorobowa;
  // FP tylko przy podstawie ≥ płacy minimalnej (duży ZUS)
  if (zus === 'duzy') suma += podstawa * ZUS_STAWKI.funduszPracy;
  return round2(suma);
}

export function b2bNetto(o: OpcjeB2B): WynikB2B {
  const przychodRok = o.przychodMies * 12;
  const kosztyRok = o.kosztyMies * 12;
  const spoleczneMies = zusSpoleczneMies(o.zus, o.chorobowe);
  const spoleczneRok = spoleczneMies * 12;

  let zdrowotnaRok: number;
  let podatekRok: number;
  let dochodRok: number;

  if (o.forma === 'ryczalt') {
    const stawka = o.stawkaRyczaltu ?? 0.12;
    // Składka zdrowotna wg progu przychodów rocznych
    const zdrowotnaMies =
      przychodRok <= 60000
        ? ZDROWOTNA.ryczalt.do60k
        : przychodRok <= 300000
          ? ZDROWOTNA.ryczalt.do300k
          : ZDROWOTNA.ryczalt.ponad300k;
    zdrowotnaRok = zdrowotnaMies * 12;
    // Podstawa: przychód − społeczne − 50% zdrowotnej (koszty NIE pomniejszają ryczałtu)
    const podstawa = Math.max(
      0,
      przychodRok - spoleczneRok - ZDROWOTNA.ryczaltOdliczenieProc * zdrowotnaRok,
    );
    podatekRok = podstawa * stawka;
    dochodRok = przychodRok - kosztyRok; // informacyjnie
  } else {
    dochodRok = Math.max(0, przychodRok - kosztyRok - spoleczneRok);
    if (o.forma === 'liniowy') {
      zdrowotnaRok = Math.max(
        dochodRok * ZDROWOTNA.liniowyProc,
        ZDROWOTNA.minimalna * 12,
      );
      // Zdrowotna odliczana od dochodu do limitu rocznego
      const odliczenie = Math.min(zdrowotnaRok, ZDROWOTNA.liniowyLimitOdliczenia);
      podatekRok = Math.max(0, (dochodRok - odliczenie) * PIT.stawkaLiniowa);
    } else {
      // skala
      zdrowotnaRok = Math.max(
        dochodRok * ZDROWOTNA.skalaProc,
        ZDROWOTNA.minimalna * 12,
      );
      podatekRok = pitSkala(dochodRok);
    }
  }

  const nettoRok = przychodRok - kosztyRok - spoleczneRok - zdrowotnaRok - podatekRok;
  const obciazenia = spoleczneRok + zdrowotnaRok + podatekRok;

  return {
    przychodMies: round2(o.przychodMies),
    kosztyMies: round2(o.kosztyMies),
    zusSpoleczneMies: round2(spoleczneRok / 12),
    zdrowotnaMies: round2(zdrowotnaRok / 12),
    podatekMies: round2(podatekRok / 12),
    nettoMies: round2(nettoRok / 12),
    dochodMies: round2(dochodRok / 12),
    efektywnaStopa: przychodRok > 0 ? round2((obciazenia / przychodRok) * 100) : 0,
  };
}

// ─── Ekwiwalent za urlop ───────────────────────────────────────────────

export interface WynikEkwiwalent {
  wspolczynnik: number;
  stawkaDzienna: number;
  stawkaGodzinowa: number;
  godzinyUrlopu: number;
  ekwiwalentBrutto: number;
}

/**
 * Ekwiwalent za niewykorzystany urlop.
 * @param podstawaMies  wynagrodzenie stanowiące podstawę (stałe + średnia zmiennych), zł/mies.
 * @param dniUrlopu     liczba dni niewykorzystanego urlopu
 * @param wymiarEtatu   np. 1, 0.5, 0.75
 */
export function ekwiwalent(
  podstawaMies: number,
  dniUrlopu: number,
  wymiarEtatu = 1,
): WynikEkwiwalent {
  const wsp = round2(WSPOLCZYNNIK_URLOPOWY * wymiarEtatu);
  const dzienna = podstawaMies / wsp;
  const godzinowa = dzienna / NORMA_DOBOWA;
  const godziny = dniUrlopu * NORMA_DOBOWA;
  return {
    wspolczynnik: wsp,
    stawkaDzienna: round2(dzienna),
    stawkaGodzinowa: round2(godzinowa),
    godzinyUrlopu: godziny,
    ekwiwalentBrutto: round2(godzinowa * godziny),
  };
}

// ─── Nadpłata kredytu ──────────────────────────────────────────────────

export interface OpcjeKredyt {
  /** Pozostały kapitał do spłaty, zł */
  kapital: number;
  /** Oprocentowanie nominalne rocznie, np. 0.0756 */
  oprocentowanie: number;
  /** Pozostały okres w miesiącach */
  okresMies: number;
  /** Stała nadpłata miesięczna, zł */
  nadplataMies: number;
  /** Jednorazowa nadpłata na start, zł */
  nadplataJednorazowa: number;
  /** 'okres' = skróć okres (rata bez zmian), 'rata' = zmniejszaj ratę (okres bez zmian) */
  tryb: 'okres' | 'rata';
}

export interface WynikKredyt {
  rataBazowa: number;
  odsetkiBez: number;
  odsetkiZ: number;
  oszczednosc: number;
  okresBezMies: number;
  okresZMies: number;
  skrocenieMies: number;
  /** Tryb 'rata': nowa rata po pierwszej nadpłacie (dalej maleje przy nadpłatach miesięcznych) */
  rataPoNadplacie: number;
}

/** Rata annuitetowa. */
export function rataAnnuitetowa(kapital: number, r: number, n: number): number {
  const rm = r / 12;
  if (rm === 0) return kapital / n;
  return (kapital * rm) / (1 - Math.pow(1 + rm, -n));
}

export function symulujNadplate(o: OpcjeKredyt): WynikKredyt {
  const rm = o.oprocentowanie / 12;
  const rataBazowa = rataAnnuitetowa(o.kapital, o.oprocentowanie, o.okresMies);

  // Scenariusz bazowy — bez nadpłat
  const odsetkiBez = rataBazowa * o.okresMies - o.kapital;

  // Scenariusz z nadpłatą — symulacja miesiąc po miesiącu
  let saldo = o.kapital - o.nadplataJednorazowa;
  let odsetkiZ = 0;
  let miesiac = 0;
  let rata = rataBazowa;
  let pozostalyOkres = o.okresMies;

  if (o.tryb === 'rata' && o.nadplataJednorazowa > 0) {
    rata = rataAnnuitetowa(saldo, o.oprocentowanie, pozostalyOkres);
  }
  let rataPoNadplacie = rata;

  while (saldo > 0.01 && miesiac < 1200) {
    miesiac++;
    pozostalyOkres--;
    const odsetkiM = saldo * rm;
    odsetkiZ += odsetkiM;
    let kapitalM = rata - odsetkiM + o.nadplataMies;
    if (kapitalM <= 0) break; // rata nie pokrywa odsetek — zabezpieczenie
    if (kapitalM > saldo) kapitalM = saldo;
    saldo -= kapitalM;
    // Tryb 'rata': po każdej nadpłacie przeliczamy ratę na pozostały pierwotny okres
    if (o.tryb === 'rata' && o.nadplataMies > 0 && pozostalyOkres > 0 && saldo > 0.01) {
      rata = rataAnnuitetowa(saldo, o.oprocentowanie, pozostalyOkres);
      if (miesiac === 1) rataPoNadplacie = rata;
    }
  }

  return {
    rataBazowa: round2(rataBazowa),
    odsetkiBez: round2(odsetkiBez),
    odsetkiZ: round2(odsetkiZ),
    oszczednosc: round2(odsetkiBez - odsetkiZ),
    okresBezMies: o.okresMies,
    okresZMies: miesiac,
    skrocenieMies: o.okresMies - miesiac,
    rataPoNadplacie: round2(rataPoNadplacie),
  };
}

// ─── Formatowanie ──────────────────────────────────────────────────────

export const zl = (x: number) =>
  new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0,
  }).format(x);

export const zlGr = (x: number) =>
  new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(x);
