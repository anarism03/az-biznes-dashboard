/**
 * 26 oktyabr 2026-cı il anonim Google Forms sorğusu (n = 29 uyğun cavab).
 * Bütün saylar xam cavablardan hesablanmışdır; dissertasiyanın III fəsli və
 * “İnnovasionnaya nauka” № 11-2-1/2026 (s. 41–47) məqaləsi ilə eynidir.
 * Faizlər müvafiq məxrəcə görə hesablanır, burada yalnız saylar saxlanılır.
 */

export interface CountItem {
  label: string
  count: number
}

export const SURVEY_DATE = '26.10.2026'

export const surveySample = {
  total: 32,
  eligible: 29,
  excluded: 3,
  questions: 20,
}

export const surveySectors: CountItem[] = [
  { label: 'İT / telekom', count: 11 },
  { label: 'Bank / maliyyə', count: 5 },
  { label: 'Dövlət / kommunal', count: 5 },
  { label: 'İstehsal', count: 3 },
  { label: 'Pərakəndə', count: 2 },
  { label: 'Təhsil / səhiyyə', count: 2 },
  { label: 'Digər', count: 1 },
]

export const surveyRoles: CountItem[] = [
  { label: 'İT', count: 9 },
  { label: 'Satış', count: 6 },
  { label: 'Analitika', count: 3 },
  { label: 'Maliyyə', count: 3 },
  { label: 'İdarəetmə', count: 3 },
  { label: 'Əməliyyat', count: 3 },
  { label: 'İnsan resursları', count: 2 },
]

export const surveyExperience: CountItem[] = [
  { label: '1 ildən az', count: 6 },
  { label: '1–3 il', count: 13 },
  { label: '4–7 il', count: 6 },
  { label: '8 il və çox', count: 4 },
]

export const usageFrequency: CountItem[] = [
  { label: 'Hər gün', count: 4 },
  { label: 'Həftədə bir neçə dəfə', count: 14 },
  { label: 'Aylıq', count: 3 },
  { label: 'Pilot mərhələsində', count: 6 },
  { label: 'Arabir', count: 1 },
  { label: 'İstifadə etmir', count: 1 },
]

export const decisionUse: CountItem[] = [
  { label: 'Müntəzəm', count: 9 },
  { label: 'Bəzən', count: 15 },
  { label: 'Xeyr', count: 2 },
  { label: 'Bilmirəm', count: 3 },
]

/** İstifadə tezliyi × qərar hazırlığında istifadə (eyni iştirakçılar). */
export const crossTab = {
  columns: ['Müntəzəm', 'Bəzən', 'Xeyr', 'Bilmirəm'],
  rows: [
    { label: 'Gündəlik və ya həftədə bir neçə dəfə', values: [7, 8, 2, 1] },
    { label: 'Digər tezliklər və istifadə etməyənlər', values: [2, 7, 0, 2] },
  ],
}

export interface LikertRow {
  statement: string
  short: string
  positive: number
  neutral: number
  negative: number
}

export const likertRows: LikertRow[] = [
  { statement: 'Məlumatların şəffaflığını artırır', short: 'Şəffaflıq', positive: 21, neutral: 8, negative: 0 },
  { statement: 'Qərar hazırlama müddətini azaldır', short: 'Qərar müddəti', positive: 23, neutral: 6, negative: 0 },
  { statement: 'Problemləri daha tez aşkar etməyə kömək edir', short: 'Problemin aşkarlanması', positive: 23, neutral: 5, negative: 1 },
  { statement: 'İl və sektor filtrləri müqayisəni asanlaşdırır', short: 'Filtrlərlə müqayisə', positive: 23, neutral: 4, negative: 2 },
  { statement: 'Hesabat üçün ayrıca analitikdən asılılığı azaldır', short: 'Analitikdən asılılıq', positive: 19, neutral: 10, negative: 0 },
]

export const reportTime: CountItem[] = [
  { label: 'Azalıb', count: 13 },
  { label: 'Dəyişməyib', count: 8 },
  { label: 'Artıb', count: 5 },
  { label: 'Qiymətləndirə bilmir', count: 3 },
]

export const financialSaving: CountItem[] = [
  { label: 'Bəli, ölçülüb', count: 7 },
  { label: 'Bəli, subyektiv müşahidə', count: 12 },
  { label: 'Xeyr', count: 6 },
  { label: 'Ölçülməyib / bilmirəm', count: 4 },
]

export const trainingNeed: CountItem[] = [
  { label: 'Bəli', count: 14 },
  { label: 'Xeyr', count: 8 },
  { label: 'Əmin deyil', count: 7 },
]

/** Çoxseçimli sual: faizlər 29-a görə hesablanır, cəmi 100%-dən çoxdur. */
export const barriers: CountItem[] = [
  { label: 'Bacarıq çatışmazlığı', count: 16 },
  { label: 'Xərc', count: 16 },
  { label: 'Texniki inteqrasiya', count: 13 },
  { label: 'Rəhbərlik dəstəyi', count: 13 },
  { label: 'Məlumat keyfiyyəti', count: 10 },
  { label: 'Çətinlik yoxdur', count: 7 },
]

/** AzərDash prototipinə baxan 26 iştirakçının qiymətləndirməsi. */
export const prototypeRating = {
  viewed: 26,
  notViewed: 3,
  items: [
    { label: 'Faydalı / çox faydalı', count: 15 },
    { label: 'Neytral', count: 7 },
    { label: 'Faydasız / çox faydasız', count: 4 },
  ] as CountItem[],
}

/** Sektor üzrə gündəlik və ya həftədə bir neçə dəfə istifadə. */
export const sectorFrequentUse = [
  { label: 'İT / telekom', n: 11, frequent: 8 },
  { label: 'Bank / maliyyə', n: 5, frequent: 4 },
  { label: 'Pərakəndə', n: 2, frequent: 2 },
  { label: 'İstehsal', n: 3, frequent: 1 },
  { label: 'Dövlət / kommunal', n: 5, frequent: 2 },
  { label: 'Təhsil / səhiyyə', n: 2, frequent: 1 },
  { label: 'Digər', n: 1, frequent: 0 },
]

export const pct = (count: number, base: number) => (base ? (count / base) * 100 : 0)
