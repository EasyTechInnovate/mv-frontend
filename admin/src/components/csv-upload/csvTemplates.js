/**
 * CSV Template definitions and helpers for bulk release upload.
 * Arrays use pipe "|" separator inside cells.
 */

// ===================== BASIC RELEASE TEMPLATE =====================
export const BASIC_RELEASE_HEADERS = [
  'trackType',        // required: single | album
  'releaseName',      // required
  'genre',            // required: EMusicGenre value
  'upc',              // optional: 12 digits
  'labelName',        // optional
  'singerName',       // optional: pipe-separated
  'releaseDate',      // optional: YYYY-MM-DD
  'territories',      // optional: pipe-separated
  'partners',         // optional: pipe-separated
  'ownsCopyright',    // optional: true/false
]

// All valid territory values (from backend ETerritories):
export const ALL_TERRITORIES = 'afghanistan|albania|algeria|andorra|angola|antigua_and_barbuda|argentina|armenia|australia|austria|azerbaijan|bahamas|bahrain|bangladesh|barbados|belarus|belgium|belize|benin|bhutan|bolivia|bosnia_and_herzegovina|botswana|brazil|brunei|bulgaria|burkina_faso|burundi|cabo_verde|cambodia|cameroon|canada|central_african_republic|chad|chile|china|colombia|comoros|congo_congo-brazzaville|costa_rica|cote_divoire|croatia|cuba|cyprus|czechia|democratic_republic_of_the_united_states_of_america|denmark|djibouti|dominica|dominican_republic|ecuador|egypt|el_salvador|equatorial_guinea|eritrea|estonia|eswatini_formerly_swaziland|ethiopia|fiji|finland|france|gabon|gambia|georgia|germany|ghana|greece|grenada|guatemala|guinea|guinea-bissau|guyana|haiti|honduras|hungary|iceland|india|indonesia|iran|iraq|ireland|israel|italy|jamaica|japan|jordan|kazakhstan|kenya|kiribati|kuwait|kyrgyzstan|laos|latvia|lebanon|lesotho|liberia|libya|liechtenstein|lithuania|luxembourg|madagascar|malawi|malaysia|maldives|mali|malta|marshall_islands|mauritania|mauritius|mexico|micronesia|moldova|monaco|mongolia|montenegro|morocco|mozambique|myanmar_formerly_burma|namibia|nauru|nepal|netherlands|new_zealand|nicaragua|niger|nigeria|north_korea|north_macedonia_formerly_macedonia|norway|oman|pakistan|palau|palestine|panama|papua_new_guinea|paraguay|peru|philippines|poland|portugal|qatar|romania|russia|rwanda|saint_kitts_and_nevis|saint_lucia|saint_vincent_and_the_grenadines|samoa|san_marino|sao_tome_and_principe|saudi_arabia|senegal|serbia|seychelles|sierra_leone|singapore|slovakia|slovenia|solomon_islands|somalia|south_africa|south_korea|south_sudan|spain|sri_lanka|sudan|suriname|sweden|switzerland|syria|taiwan|tajikistan|tanzania|thailand|timor-leste|togo|tonga|trinidad_and_tobago|tunisia|turkey|turkmenistan|tuvalu|uganda|ukraine|united_arab_emirates|united_kingdom|united_states_of_america|uruguay|uzbekistan|vanuatu|vatican_city|venezuela|vietnam|yemen|zambia|zimbabwe'

// All valid distribution partner values (from backend EDistributionPartners):
export const ALL_DISTRIBUTION_PARTNERS = 'jio|airtel|bsnl|vi|gaana|hungama|jiosaavn|wynk|7digital|mixupload|deezer|soundcloud|ami_entertainment|simfy|slacker|soundexchange|gracenote|lickd|8tracks|likee|monkingme|imusica|appler_music|touchtunes|traxsource|pandora|tidal|juno_downloads|shazam|sberzvuk|spotify|bmat|kkbox|medianet|amazon|napster|dailymotion|awa|iheart_radio|boomplay|facebook_audio_library|facebook_audio_footprinting|alibaba|netease|tencent|audible_magic|muso.ai|saavn|united_media_agency|mixcloud|kuack_media_group|siriusxm|anghami|qobuz|clicknclear|tunedglobal|flo|acrcloud|moodagent|enaza|youtube_art_tracks|youtube_content_id|joox|ipex|jaxsta|melon|pretzel|resso|tiktok|scpp|soundmouse|triller|yandex|zaycev|audiomack|youtube_music|instagram_reels|snapchat|bandcamp'

export const BASIC_RELEASE_SAMPLE = [
  {
    trackType: 'single',
    releaseName: 'My First Song',
    genre: 'folk',
    upc: '',
    labelName: 'Maheshwari Visuals',
    singerName: 'Artist One|Artist Two',
    releaseDate: '2026-06-01',
    territories: ALL_TERRITORIES,
    partners: ALL_DISTRIBUTION_PARTNERS,
    ownsCopyright: 'true',
  },
 
]

// ===================== ADVANCED RELEASE TEMPLATE =====================
export const ADVANCED_RELEASE_HEADERS = [
  'releaseType',        // required: single | album | ep | mini_album | ringtone_release
  'releaseName',        // required
  'releaseVersion',     // optional
  'catalog',            // optional
  'primaryArtists',     // optional: pipe-separated
  'variousArtists',     // optional: pipe-separated
  'featuringArtists',   // optional: pipe-separated
  'needsUPC',           // optional: true/false
  'upcCode',            // optional
  'primaryGenre',       // optional: EMusicGenre value
  'secondaryGenre',     // optional: EMusicGenre value
  'labelName',          // optional
  'cLineYear',          // optional: e.g. 2025
  'cLineText',          // optional
  'pLineYear',          // optional: e.g. 2025
  'pLineText',          // optional
  'releasePricingTier', // optional: front | mid | back
  'releaseDate',        // optional: YYYY-MM-DD
  'isWorldwide',        // optional: true/false
  'territories',        // optional: pipe-separated
  'distributionPartners', // optional: pipe-separated
  'ownsCopyrights',     // optional: true/false
  'proceedWithoutCopyright', // optional: true/false
]

export const ADVANCED_RELEASE_SAMPLE = [
  {
    releaseType: 'single',
    releaseName: 'My Advanced Song',
    releaseVersion: '',
    catalog: '',
    primaryArtists: 'Artist One|Artist Two',
    variousArtists: '',
    featuringArtists: '',
    needsUPC: 'true',
    upcCode: '',
    primaryGenre: 'folk',
    secondaryGenre: 'folk',
    labelName: 'Maheshwari Visuals',
    cLineYear: '2026',
    cLineText: '2026 My Label',
    pLineYear: '2026',
    pLineText: '2026 My Label',
    releasePricingTier: 'mid',
    releaseDate: '2026-06-01',
    isWorldwide: 'true',
    territories: ALL_TERRITORIES,
    distributionPartners: ALL_DISTRIBUTION_PARTNERS,
    ownsCopyrights: 'true',
    proceedWithoutCopyright: 'false',
  },
  
]

// ===================== BASIC TRACK TEMPLATE =====================
export const BASIC_TRACK_HEADERS = [
  'releaseId',          // required: e.g. BSR-SG-0001
  'trackName',          // required
  'genre',              // required: EMusicGenre value
  'composerName',       // optional
  'lyricistName',       // optional
  'singerName',         // optional
  'producerName',       // optional
  'isrc',               // optional
  'language',           // optional: EMusicLanguage value
  'previewStartTiming', // optional: HH:MM:SS
]

export const BASIC_TRACK_SAMPLE = [
   {
    releaseId: 'RE-B-S-001',
    trackName: 'Single Track ',
    genre: 'pop',
    composerName: 'Composer Name',
    lyricistName: 'Lyricist Name',
    singerName: 'Singer Name',
    producerName: 'Producer Name',
    isrc: '',
    language: 'hindi',
    language: 'hindi',
    previewStartTiming: '00:00:30',
  },
  {
    releaseId: 'RE-B-A-002',
    trackName: 'Track One',
    genre: 'pop',
    composerName: 'Composer Name',
    lyricistName: 'Lyricist Name',
    singerName: 'Singer Name',
    producerName: 'Producer Name',
    isrc: '',
    language: 'hindi',
    language: 'hindi',
    previewStartTiming: '00:00:30',
  },
  {
    releaseId: 'RE-B-A-002',
    trackName: 'Track Two',
    genre: 'pop',
    composerName: 'Composer Name',
    lyricistName: 'Lyricist Name',
    singerName: 'Singer Name',
    producerName: 'Producer Name',
    isrc: '',
    language: 'hindi',
    language: 'hindi',
    previewStartTiming: '00:00:30',
  }
]

// ===================== ADVANCED TRACK TEMPLATE =====================
export const ADVANCED_TRACK_HEADERS = [
  'releaseId',            // required
  'trackName',            // required
  'primaryArtists',       // required: pipe-separated
  'featuringArtists',     // optional: pipe-separated
  'contributorsSoundRecording', // optional: profession1:name1|profession2:name2
  'contributorsMusicalWork',    // optional: profession1:name1|profession2:name2
  'primaryGenre',         // required: EMusicGenre value
  'secondaryGenre',       // optional: EMusicGenre value
  'mixVersion',           // optional
  'needsISRC',            // optional: true/false
  'isrcCode',             // optional
  'hasHumanVocals',       // optional: true/false (default true)
  'language',             // optional: EMusicLanguage value
  'isAvailableForDownload', // optional: true/false (default true)
  'previewStartTiming',   // optional: HH:MM:SS
]

export const ADVANCED_TRACK_SAMPLE = [
  {
    releaseId: 'RE-A-S-001',
    trackName: 'Advanced Track One',
    primaryArtists: 'Artist One|Artist Two',
    featuringArtists: 'Artist One|Artist Two',
    contributorsSoundRecording: 'Producer:John Doe|Mixer:Jane Doe',
    contributorsMusicalWork: 'Composer:John Doe|Lyricist:Jane Doe',
    primaryGenre: 'pop',
    secondaryGenre: 'pop',
    mixVersion: '',
    needsISRC: 'true',
    isrcCode: '',
    hasHumanVocals: 'true',
    language: 'hindi',
    isAvailableForDownload: 'true',
    previewStartTiming: '00:00:30',
  }
]

/**
 * Generate CSV content string from headers and sample data
 */
export function generateCsvTemplate(headers, sampleData = []) {
  const lines = [headers.join(',')]
  sampleData.forEach(row => {
    const values = headers.map(h => {
      const val = row[h] || ''
      // Wrap in quotes if contains comma or pipe
      if (val.includes(',') || val.includes('|') || val.includes('"')) {
        return `"${val.replace(/"/g, '""')}"`
      }
      return val
    })
    lines.push(values.join(','))
  })
  return lines.join('\n')
}

/**
 * Trigger CSV file download in browser
 */
export function downloadCsvTemplate(filename, headers, sampleData = []) {
  const content = generateCsvTemplate(headers, sampleData)
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
