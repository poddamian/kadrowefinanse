/**
 * Parametry prawne i podatkowe na rok 2026.
 * JEDNO ŹRÓDŁO PRAWDY — każda zmiana przepisów aktualizowana tylko tutaj.
 *
 * Źródła (stan na 07.2026):
 * - Płaca minimalna i podstawy ZUS: zus.pl, infor.pl
 * - Składka zdrowotna 2026: infakt.pl, zus.pl (koniec preferencji 75% min. wynagrodzenia)
 * - Skala PIT: pit.pl, e-pity.pl
 * - Współczynnik ekwiwalentu: gofin.pl, prawo.pl
 */

export const ROK = 2026;

/** Płaca minimalna od 1.01.2026 (zł/mies.) */
export const PLACA_MINIMALNA = 4806;

/** Prognozowane przeciętne wynagrodzenie 2026 (podstawa dużego ZUS = 60% tej kwoty) */
export const PRZECIETNE_PROGNOZOWANE = 9420;

/** Roczny limit podstawy składek emerytalno-rentowych (30-krotność) */
export const LIMIT_30_KROTNOSCI = 30 * PRZECIETNE_PROGNOZOWANE; // 282 600 zł

// ─── Skala podatkowa PIT ───────────────────────────────────────────────
export const PIT = {
  /** Kwota wolna od podatku (rocznie) */
  kwotaWolna: 30000,
  /** Roczna kwota zmniejszająca podatek (30 000 × 12%) */
  kwotaZmniejszajaca: 3600,
  /** Próg drugiej stawki (rocznie) */
  prog: 120000,
  stawka1: 0.12,
  stawka2: 0.32,
  /** Podatek liniowy dla JDG */
  stawkaLiniowa: 0.19,
} as const;

// ─── Umowa o pracę: składki pracownika ─────────────────────────────────
export const UOP = {
  emerytalna: 0.0976,
  rentowa: 0.015,
  chorobowa: 0.0245,
  /** Suma składek społecznych pracownika (13,71% brutto) */
  spoleczneRazem: 0.0976 + 0.015 + 0.0245,
  /** Składka zdrowotna: 9% podstawy (brutto − społeczne) */
  zdrowotna: 0.09,
  /** Koszty uzyskania przychodu (zł/mies.): standardowe / dojeżdżający */
  kupStandard: 250,
  kupDojazd: 300,
} as const;

// ─── JDG: składki społeczne przedsiębiorcy ─────────────────────────────
/** Minimalna podstawa "dużego ZUS" 2026 = 60% przeciętnego prognozowanego */
export const ZUS_DUZY_PODSTAWA = 5652;
/** Podstawa preferencyjnego ZUS = 30% płacy minimalnej */
export const ZUS_PREF_PODSTAWA = 0.3 * PLACA_MINIMALNA; // 1441,80 zł

export const ZUS_STAWKI = {
  emerytalna: 0.1952,
  rentowa: 0.08,
  /** Dobrowolna dla przedsiębiorcy */
  chorobowa: 0.0245,
  /** Standardowa dla małych płatników */
  wypadkowa: 0.0167,
  /** Fundusz Pracy + FS — nie płaci się przy podstawie niższej niż płaca minimalna */
  funduszPracy: 0.0245,
} as const;

// ─── Składka zdrowotna JDG 2026 ────────────────────────────────────────
export const ZDROWOTNA = {
  /** Skala podatkowa: 9% dochodu */
  skalaProc: 0.09,
  /** Podatek liniowy: 4,9% dochodu */
  liniowyProc: 0.049,
  /**
   * Minimalna miesięczna składka (luty–grudzień 2026): 9% × płaca minimalna.
   * Uwaga: za styczeń 2026 (jeszcze stary rok składkowy) było 314,96 zł —
   * dla uproszczenia kalkulator liczy wg stawki obowiązującej większość roku.
   */
  minimalna: Math.round(0.09 * PLACA_MINIMALNA * 100) / 100, // 432,54 zł
  /** Roczny limit odliczenia zdrowotnej od dochodu (liniowy) */
  liniowyLimitOdliczenia: 14100,
  /** Ryczałt: składka miesięczna wg progu przychodów rocznych (rok składkowy 02.2026–01.2027) */
  ryczalt: {
    do60k: 498.35,
    do300k: 830.58,
    ponad300k: 1495.04,
  },
  /** Na ryczałcie od przychodu odlicza się 50% zapłaconych składek zdrowotnych */
  ryczaltOdliczenieProc: 0.5,
} as const;

// ─── Ekwiwalent za urlop ───────────────────────────────────────────────
/** Współczynnik urlopowy 2026: [365 − (52 niedziele + 10 świąt + 52 wolne)] / 12 */
export const WSPOLCZYNNIK_URLOPOWY = 20.92;
/** Dobowa norma czasu pracy (godz.) */
export const NORMA_DOBOWA = 8;

/** Popularne stawki ryczałtu (do wyboru w kalkulatorze) */
export const STAWKI_RYCZALTU = [
  { stawka: 0.085, opis: '8,5% — większość usług' },
  { stawka: 0.12, opis: '12% — IT (programowanie)' },
  { stawka: 0.14, opis: '14% — medycyna, architektura, inżynieria' },
  { stawka: 0.15, opis: '15% — pośrednictwo, reklama' },
  { stawka: 0.17, opis: '17% — wolne zawody' },
  { stawka: 0.055, opis: '5,5% — roboty budowlane' },
  { stawka: 0.03, opis: '3% — handel' },
] as const;
