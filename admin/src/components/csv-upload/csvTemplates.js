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

export const BASIC_RELEASE_SAMPLE = [
  {
    trackType: 'single',
    releaseName: 'My First Song',
    genre: 'pop',
    upc: '',
    labelName: 'Maheshwari Visuals',
    singerName: 'Artist One|Artist Two',
    releaseDate: '2026-06-01',
    territories: 'india|afghanistan',
    partners: 'spotify|youtube_music',
    ownsCopyright: 'true',
  }
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
    primaryGenre: 'pop',
    secondaryGenre: 'rock',
    cLineYear: '2026',
    cLineText: '2026 My Label',
    pLineYear: '2026',
    pLineText: '2026 My Label',
    releasePricingTier: 'mid',
    releaseDate: '2026-06-01',
    isWorldwide: 'true',
    territories: 'india|afghanistan',
    distributionPartners: 'spotify|youtube_music',
    ownsCopyrights: 'true',
    proceedWithoutCopyright: 'false',
  }
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
  'previewStartTime',   // optional: seconds
  'previewEndTime',     // optional: seconds
  'callerTuneStartTime', // optional: seconds
  'callerTuneEndTime',  // optional: seconds
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
    previewStartTime: '0',
    previewEndTime: '30',
    callerTuneStartTime: '0',
    callerTuneEndTime: '30',
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
    previewStartTime: '0',
    previewEndTime: '30',
    callerTuneStartTime: '0',
    callerTuneEndTime: '30',
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
    previewStartTime: '0',
    previewEndTime: '30',
    callerTuneStartTime: '0',
    callerTuneEndTime: '30',
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
  'previewStartTiming',   // optional: seconds
  'callertuneStartTiming', // optional: seconds
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
    previewStartTiming: '0',
    callertuneStartTiming: '0',
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
