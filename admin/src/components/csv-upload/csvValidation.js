/**
 * CSV Validation utilities for bulk release upload.
 * Validates parsed CSV rows against backend model constraints.
 */

// ===================== ENUM VALUES =====================
// ===================== ENUM VALUES =====================
export const TRACK_TYPES = ['single', 'album']
export const ADVANCED_RELEASE_TYPES = ['single', 'album', 'ep', 'mini_album', 'ringtone_release']
export const PRICING_TIERS = ['front', 'mid', 'back']

export const VALID_SOUND_RECORDING_ROLES = [
  'actor', 'brand', 'choir', 'conductor', 'ensemble', 'mixer',
  'orchestra', 'musician', 'producer', 'programmer', 'remixer',
  'soloist', 'studio personnel'
]

export const VALID_MUSICAL_WORK_ROLES = [
  'arranger', 'composer', 'librettist', 'lyricist',
  'publisher', 'non-lyric author', 'translator'
]

const MUSIC_GENRES = [
  'alternative', 'alternative_rock', 'alternative_and_rock_latino', 'anime',
  'baladas_y_boleros', 'big_band', 'blues', 'brazilian', 'c_pop',
  'cantopop_hk_pop', 'childrens', 'chinese', 'christian', 'classical',
  'comedy', 'contemporary_latin', 'country', 'dance', 'easy_listening',
  'educational', 'electronic', 'enka', 'experimental', 'fitness_and_workout',
  'folk', 'french_pop', 'german_pop', 'german_folk', 'hip_hop_rap',
  'holiday', 'instrumental', 'indo_pop', 'inspirational', 'indian',
  'indian_pop', 'indian_rap', 'indian_folk', 'indian_bollywood',
  'indian_devotional_and_spiritual', 'indian_fusion', 'indian_gazal',
  'indian_classical_vocal', 'indian_dance', 'indian_electronic',
  'jazz', 'j_pop', 'k_pop', 'karaoke', 'latin_jazz', 'metal',
  'new_age', 'opera', 'pop', 'punk', 'r_and_b', 'reggae',
  'reggaeton_y_hip_hop', 'regional_mexicano', 'rock', 'salas_y_topical',
  'soul', 'soundtrack', 'spoken_word', 'thai_pop', 'trot',
  'vocal_nostalgia', 'world'
]

const MUSIC_LANGUAGES = [
  'instrumental', 'afrikaans', 'albanian', 'amharic', 'arabic', 'aragonese',
  'armenian', 'asturian', 'azerbaijani', 'basque', 'belarusian', 'bengali',
  'bhojpuri', 'bosnian', 'breton', 'bulgarian', 'catalan', 'central_kurdish', 'chinese',
  'corsican', 'croatian', 'czech', 'danish', 'dutch', 'english',
  'english_australia', 'english_canada', 'english_india', 'english_us',
  'english_uk', 'english_new_zealand', 'english_south_africa', 'estenian',
  'fareese', 'filipino', 'finnish', 'french', 'galician', 'georgian',
  'german', 'gurani', 'gujrati', 'hausa', 'hawaiian', 'hebrew', 'hindi',
  'hungarian', 'icelandic', 'indonesian', 'interlingua', 'irish', 'italian',
  'japanese', 'kannada', 'kazakh', 'khmer', 'koren', 'kurdish', 'kyrgyz',
  'lao', 'latin', 'latvian', 'lingala', 'lithuanian', 'macedonian',
  'malay', 'malayalam', 'maltese', 'marathi', 'mongolian', 'nagpuri',
  'nepali', 'norwegian', 'occitan', 'odia', 'oromo', 'pashto', 'persian',
  'polish', 'portuguese', 'punjabi', 'quechua', 'romanian', 'russian',
  'sainthili', 'scottish', 'serbian', 'sindhi', 'shono', 'sinhala',
  'slovak', 'slovenian', 'somali', 'spanish', 'sundanese', 'swahili',
  'swedish', 'tajik', 'tamil', 'tatar', 'telugu', 'thai', 'tigrinya',
  'tongan', 'turkish', 'turkmen', 'twi', 'ukrainian', 'urdu', 'uyghur',
  'uzbek', 'vietnamese', 'walloon', 'wetish', 'western_frisian', 'xhosa',
  'yiddish', 'yoruba', 'zulu'
]

// Snake_case values from backend
export const DISTRIBUTION_PARTNERS = [
    'jio', 'airtel', 'bsnl', 'vi', 'gaana', 'hungama', 'jiosaavn', 'wynk',
    '7digital', 'mixupload', 'deezer', 'soundcloud', 'ami_entertainment', 'simfy',
    'slacker', 'soundexchange', 'gracenote', 'lickd', '8tracks', 'likee',
    'monkingme', 'imusica', 'appler_music', 'touchtunes', 'traxsource', 'pandora',
    'tidal', 'juno_downloads', 'shazam', 'sberzvuk', 'spotify', 'bmat', 'kkbox',
    'medianet', 'amazon', 'napster', 'dailymotion', 'awa', 'iheart_radio', 'boomplay',
    'facebook_audio_library', 'facebook_audio_footprinting', 'alibaba', 'netease',
    'tencent', 'audible_magic', 'muso.ai', 'saavn', 'united_media_agency',
    'mixcloud', 'kuack_media_group', 'siriusxm', 'anghami', 'qobuz', 'clicknclear',
    'tunedglobal', 'flo', 'acrcloud', 'moodagent', 'enaza', 'youtube_art_tracks',
    'youtube_content_id', 'joox', 'ipex', 'jaxsta', 'melon', 'pretzel', 'resso',
    'tiktok', 'scpp', 'soundmouse', 'triller', 'yandex', 'zaycev', 'audiomack',
    'youtube_music', 'instagram_reels', 'snapchat', 'bandcamp'
]

// Helper to check valid territory (simplified)
// Ideally we valid against ETerritories values
export const isValidTerritory = (val) => {
    if (!val) return false
    // Since list is huge, we'll assume any slug-like string is valid for now to avoid 300 line file
    // Or we will validate against the options passed from UI
    return val.length > 2
}

// ===================== HELPERS =====================
function parseBool(val) {
  if (!val || val === '') return undefined
  const lower = String(val).toLowerCase().trim()
  if (lower === 'true' || lower === '1' || lower === 'yes') return true
  if (lower === 'false' || lower === '0' || lower === 'no') return false
  return undefined
}

function parsePipeArray(val) {
  if (!val || val === '') return []
  return String(val).split('|').map(s => s.trim()).filter(Boolean)
}

function parseContributors(val) {
  if (!val || val === '') return []
  return parsePipeArray(val).map(item => {
    const [profession, ...rest] = item.split(':')
    return {
      profession: (profession || '').trim(),
      contributors: rest.join(':').trim()
    }
  }).filter(c => c.profession && c.contributors)
}

// Handles both JSON stringified (from preview editor) and pipe-separated (raw CSV) formats
function parseContributorsFlexible(val) {
  if (!val || val === '') return []
  // Try JSON parse first (from preview editor)
  try {
    const parsed = JSON.parse(val)
    if (Array.isArray(parsed)) {
      return parsed.filter(c => c.profession && c.contributors)
    }
  } catch (e) {
    // Not JSON, fall back to pipe-separated format
  }
  return parseContributors(val)
}

function isValidDate(str) {
  if (!str) return true
  const d = new Date(str)
  return !isNaN(d.getTime())
}

// ===================== VALIDATORS =====================

/**
 * Validate a single basic release row.
 * Returns array of error strings (empty = valid).
 */
export function validateBasicReleaseRow(row, index) {
  const errors = []
  const rowNum = index + 1

  if (!row.trackType || !TRACK_TYPES.includes(row.trackType.toLowerCase().trim())) {
    errors.push(`Row ${rowNum}: trackType is required (single or album)`)
  }
  if (!row.releaseName || !row.releaseName.trim()) {
    errors.push(`Row ${rowNum}: releaseName is required`)
  }
  if (!row.genre || !MUSIC_GENRES.includes(row.genre.toLowerCase().trim())) {
    errors.push(`Row ${rowNum}: genre is required and must be a valid genre`)
  }
  if (row.upc && !/^[0-9]{12}$/.test(row.upc.trim())) {
    errors.push(`Row ${rowNum}: upc must be exactly 12 digits`)
  }
  if (row.releaseDate && !isValidDate(row.releaseDate)) {
    errors.push(`Row ${rowNum}: releaseDate must be YYYY-MM-DD format`)
  }
  
  // Validate Territories
  if (row.territories) {
      const terrs = parsePipeArray(row.territories)
      // Optional: check if valid. For now allowing non-empty.
  }

  // Validate Partners
  if (row.partners) {
      const parts = parsePipeArray(row.partners)
      const invalid = parts.filter(p => !DISTRIBUTION_PARTNERS.includes(p.toLowerCase()))
      if (invalid.length > 0) {
          errors.push(`Row ${rowNum}: Invalid partners: ${invalid.join(', ')}`)
      }
  }

  return errors
}

/**
 * Validate a single advanced release row.
 */
export function validateAdvancedReleaseRow(row, index) {
  const errors = []
  const rowNum = index + 1

  if (!row.releaseType || !ADVANCED_RELEASE_TYPES.includes(row.releaseType.toLowerCase().trim())) {
    errors.push(`Row ${rowNum}: releaseType is required (${ADVANCED_RELEASE_TYPES.join(', ')})`)
  }
  if (!row.releaseName || !row.releaseName.trim()) {
    errors.push(`Row ${rowNum}: releaseName is required`)
  }
  if (row.primaryGenre && !MUSIC_GENRES.includes(row.primaryGenre.toLowerCase().trim())) {
    errors.push(`Row ${rowNum}: primaryGenre must be a valid genre`)
  }
  if (row.secondaryGenre && !MUSIC_GENRES.includes(row.secondaryGenre.toLowerCase().trim())) {
    errors.push(`Row ${rowNum}: secondaryGenre must be a valid genre`)
  }
  if (row.releasePricingTier && !PRICING_TIERS.includes(row.releasePricingTier.toLowerCase().trim())) {
    errors.push(`Row ${rowNum}: releasePricingTier must be front, mid, or back`)
  }
  if (row.releaseDate && !isValidDate(row.releaseDate)) {
    errors.push(`Row ${rowNum}: releaseDate must be YYYY-MM-DD`)
  }

  if (row.distributionPartners) {
      const parts = parsePipeArray(row.distributionPartners)
      const invalid = parts.filter(p => !DISTRIBUTION_PARTNERS.includes(p.toLowerCase()))
      if (invalid.length > 0) {
          errors.push(`Row ${rowNum}: Invalid distributionPartners: ${invalid.join(', ')}`)
      }
  }

  return errors
}

/**
 * Validate a single basic track row.
 */
export function validateBasicTrackRow(row, index) {
  const errors = []
  const rowNum = index + 1

  if (!row.releaseId || !row.releaseId.trim()) {
    errors.push(`Row ${rowNum}: releaseId is required`)
  }
  if (!row.trackName || !row.trackName.trim()) {
    errors.push(`Row ${rowNum}: trackName is required`)
  }
  if (!row.genre || !MUSIC_GENRES.includes(row.genre.toLowerCase().trim())) {
    errors.push(`Row ${rowNum}: genre is required and must be a valid genre`)
  }
  if (row.language && !MUSIC_LANGUAGES.includes(row.language.toLowerCase().trim())) {
    errors.push(`Row ${rowNum}: language must be a valid language`)
  }
  if (row.previewStartTiming && !/^(\d{2}):(\d{2}):(\d{2})$/.test(row.previewStartTiming.trim())) {
    errors.push(`Row ${rowNum}: previewStartTiming must be in HH:MM:SS format (e.g., 00:00:30)`)
  }

  return errors;
}

/**
 * Validate a single advanced track row.
 */
export function validateAdvancedTrackRow(row, index) {
  const errors = []
  const rowNum = index + 1

  if (!row.releaseId || !row.releaseId.trim()) {
    errors.push(`Row ${rowNum}: releaseId is required`)
  }
  if (!row.trackName || !row.trackName.trim()) {
    errors.push(`Row ${rowNum}: trackName is required`)
  }
  if (!row.primaryArtists || !row.primaryArtists.trim()) {
    errors.push(`Row ${rowNum}: primaryArtists is required`)
  }
  if (!row.primaryGenre || !MUSIC_GENRES.includes(row.primaryGenre.toLowerCase().trim())) {
    errors.push(`Row ${rowNum}: primaryGenre is required and must be a valid genre`)
  }
  if (row.secondaryGenre && !MUSIC_GENRES.includes(row.secondaryGenre.toLowerCase().trim())) {
    errors.push(`Row ${rowNum}: secondaryGenre must be a valid genre`)
  }
  if (row.language && !MUSIC_LANGUAGES.includes(row.language.toLowerCase().trim())) {
    errors.push(`Row ${rowNum}: language must be a valid language`)
  }
  if (row.previewStartTiming && !/^(\d{2}):(\d{2}):(\d{2})$/.test(row.previewStartTiming.trim())) {
    errors.push(`Row ${rowNum}: previewStartTiming must be in HH:MM:SS format (e.g., 00:00:30)`)
  }

  // Validate contributor roles
  if (row.contributorsSoundRecording) {
    const contribs = parseContributorsFlexible(row.contributorsSoundRecording)
    const invalidRoles = contribs
      .map(c => c.profession?.toLowerCase().trim())
      .filter(r => r && !VALID_SOUND_RECORDING_ROLES.includes(r))
    if (invalidRoles.length > 0) {
      errors.push(`Row ${rowNum}: Invalid Sound Recording roles: ${invalidRoles.join(', ')}`)
    }
  }
  if (row.contributorsMusicalWork) {
    const contribs = parseContributorsFlexible(row.contributorsMusicalWork)
    const invalidRoles = contribs
      .map(c => c.profession?.toLowerCase().trim())
      .filter(r => r && !VALID_MUSICAL_WORK_ROLES.includes(r))
    if (invalidRoles.length > 0) {
      errors.push(`Row ${rowNum}: Invalid Musical Work roles: ${invalidRoles.join(', ')}`)
    }
  }

  return errors
}

// ===================== ROW TO API PAYLOAD MAPPERS =====================

/**
 * Convert a basic release CSV row into API payload for createForUser
 */
export function basicReleaseRowToPayload(row, userId) {
  const payload = {
    userId,
    trackType: row.trackType.toLowerCase().trim(),
    step1: {
      releaseInfo: {
        releaseName: row.releaseName.trim(),
        genre: row.genre.toLowerCase().trim(),
      }
    },
    step3: {}
  }

  if (row.labelName?.trim()) payload.step1.releaseInfo.labelName = row.labelName.trim()
  if (row.upc?.trim()) payload.step1.releaseInfo.upc = row.upc.trim()

  const singerName = parsePipeArray(row.singerName)
  if (singerName.length > 0) {
    if (!payload.step1.coverArt) payload.step1.coverArt = {}
    payload.step1.coverArt.singerName = singerName
  }

  if (row.releaseDate?.trim()) payload.step3.releaseDate = row.releaseDate.trim()

  const territories = parsePipeArray(row.territories)
  if (territories.length > 0) {
    payload.step3.territorialRights = { 
      hasRights: true,
      territories: territories 
    }
  }

  const partners = parsePipeArray(row.partners)
  if (partners.length > 0) {
    payload.step3.partnerSelection = { 
      hasPartners: true, 
      partners: partners 
    }
  }

  const ownsCopyright = parseBool(row.ownsCopyright)
  if (ownsCopyright !== undefined) {
    payload.step3.copyrights = { ownsCopyright }
  }

  return payload
}

/**
 * Convert an advanced release CSV row into API payload for createForUser
 */
export function advancedReleaseRowToPayload(row, userId) {
  const payload = {
    userId,
    releaseType: row.releaseType.toLowerCase().trim(),
    step1: {
      releaseInfo: {
        releaseName: row.releaseName.trim(),
      }
    },
    step3: {}
  }

  const info = payload.step1.releaseInfo
  if (row.labelName?.trim()) info.labelName = row.labelName.trim()
  if (row.releaseVersion?.trim()) info.releaseVersion = row.releaseVersion.trim()
  if (row.catalog?.trim()) info.catalog = row.catalog.trim()

  const primaryArtists = parsePipeArray(row.primaryArtists)
  if (primaryArtists.length) info.primaryArtists = primaryArtists

  const variousArtists = parsePipeArray(row.variousArtists)
  if (variousArtists.length) info.variousArtists = variousArtists

  const featuringArtists = parsePipeArray(row.featuringArtists)
  if (featuringArtists.length) info.featuringArtists = featuringArtists

  const needsUPC = parseBool(row.needsUPC)
  if (needsUPC !== undefined) info.needsUPC = needsUPC
  if (row.upcCode?.trim()) info.upcCode = row.upcCode.trim()

  if (row.primaryGenre?.trim()) info.primaryGenre = row.primaryGenre.toLowerCase().trim()
  if (row.secondaryGenre?.trim()) info.secondaryGenre = row.secondaryGenre.toLowerCase().trim()

  if (row.cLineYear?.trim() || row.cLineText?.trim()) {
    info.cLine = {}
    if (row.cLineYear?.trim()) info.cLine.year = parseInt(row.cLineYear.trim())
    if (row.cLineText?.trim()) info.cLine.text = row.cLineText.trim()
  }
  if (row.pLineYear?.trim() || row.pLineText?.trim()) {
    info.pLine = {}
    if (row.pLineYear?.trim()) info.pLine.year = parseInt(row.pLineYear.trim())
    if (row.pLineText?.trim()) info.pLine.text = row.pLineText.trim()
  }
  if (row.releasePricingTier?.trim()) info.releasePricingTier = row.releasePricingTier.toLowerCase().trim()

  // Step3
  if (row.releaseDate?.trim()) {
    payload.step3.deliveryDetails = {
      releaseDate: row.releaseDate.trim()
    }
  }

  const isWorldwide = parseBool(row.isWorldwide)
  const territories = parsePipeArray(row.territories)
  if (isWorldwide !== undefined || territories.length) {
    payload.step3.territorialRights = {}
    if (isWorldwide !== undefined) payload.step3.territorialRights.isWorldwide = isWorldwide
    if (territories.length) payload.step3.territorialRights.territories = territories
  }

  const partners = parsePipeArray(row.distributionPartners)
  if (partners.length) payload.step3.distributionPartners = partners

  const ownsCopyrights = parseBool(row.ownsCopyrights)
  const proceedWithout = parseBool(row.proceedWithoutCopyright)
  if (ownsCopyrights !== undefined || proceedWithout !== undefined) {
    payload.step3.copyrightOptions = {}
    if (ownsCopyrights !== undefined) payload.step3.copyrightOptions.ownsCopyrights = ownsCopyrights
    if (proceedWithout !== undefined) payload.step3.copyrightOptions.proceedWithoutCopyright = proceedWithout
  }

  return payload
}

/**
 * Convert basic track CSV rows (grouped by releaseId) into API payload.
 * Returns { releaseId, step2: { tracks: [...] } }
 */
export function basicTrackRowsToPayload(rows) {
  const tracks = rows.map(row => {
    const track = {
      trackName: row.trackName.trim(),
      genre: row.genre.toLowerCase().trim(),
    }
    if (row.composerName?.trim()) track.composerName = row.composerName.trim()
    if (row.lyricistName?.trim()) track.lyricistName = row.lyricistName.trim()
    if (row.singerName?.trim()) track.singerName = row.singerName.trim()
    if (row.producerName?.trim()) track.producerName = row.producerName.trim()
    if (row.isrc?.trim()) track.isrc = row.isrc.trim()
    if (row.language?.trim()) track.language = row.language.toLowerCase().trim()

    if (row.language?.trim()) track.language = row.language.toLowerCase().trim()

    if (row.previewStartTiming?.trim()) {
      track.previewStartTiming = row.previewStartTiming.trim()
    }

    return track
  })

  return { step2: { tracks } }
}

/**
 * Convert advanced track CSV rows (grouped by releaseId) into API payload.
 */
export function advancedTrackRowsToPayload(rows) {
  const tracks = rows.map(row => {
    const track = {
      trackLink: '', // Placeholder — will be uploaded separately
      trackName: row.trackName.trim(),
      primaryArtists: parsePipeArray(row.primaryArtists),
      primaryGenre: row.primaryGenre.toLowerCase().trim(),
    }

    const feat = parsePipeArray(row.featuringArtists)
    if (feat.length) track.featuringArtists = feat
    if (row.mixVersion?.trim()) track.mixVersion = row.mixVersion.trim()

    const needsISRC = parseBool(row.needsISRC)
    if (needsISRC !== undefined) track.needsISRC = needsISRC
    if (row.isrcCode?.trim()) track.isrcCode = row.isrcCode.trim()

    const hasVocals = parseBool(row.hasHumanVocals)
    if (hasVocals !== undefined) track.hasHumanVocals = hasVocals

    if (row.language?.trim()) track.language = row.language.toLowerCase().trim()
    if (row.secondaryGenre?.trim()) track.secondaryGenre = row.secondaryGenre.toLowerCase().trim()

    const availDownload = parseBool(row.isAvailableForDownload)
    if (availDownload !== undefined) track.isAvailableForDownload = availDownload

    if (row.previewStartTiming?.trim()) {
      track.previewStartTiming = row.previewStartTiming.trim()
    }

    const soundRecContrib = parseContributorsFlexible(row.contributorsSoundRecording)
    if (soundRecContrib.length) track.contributorsToSoundRecording = soundRecContrib

    const musicalContrib = parseContributorsFlexible(row.contributorsMusicalWork)
    if (musicalContrib.length) track.contributorsToMusicalWork = musicalContrib

    return track
  })

  return { step2: { tracks } }
}
