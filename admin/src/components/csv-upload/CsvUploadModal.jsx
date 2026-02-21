import { useState, useCallback } from 'react'
import Papa from 'papaparse'
import { toast } from 'sonner'
import GlobalApi from '@/lib/GlobalApi'
import { Button } from '@/components/ui/button'
import { X, Upload, Download, FileSpreadsheet, Music, Disc3, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

import {
  BASIC_RELEASE_HEADERS, BASIC_RELEASE_SAMPLE,
  ADVANCED_RELEASE_HEADERS, ADVANCED_RELEASE_SAMPLE,
  BASIC_TRACK_HEADERS, BASIC_TRACK_SAMPLE,
  ADVANCED_TRACK_HEADERS, ADVANCED_TRACK_SAMPLE,
  downloadCsvTemplate
} from './csvTemplates'

import {
  validateBasicReleaseRow,
  validateAdvancedReleaseRow,
  validateBasicTrackRow,
  validateAdvancedTrackRow,
  basicReleaseRowToPayload,
  advancedReleaseRowToPayload,
  basicTrackRowsToPayload,
  advancedTrackRowsToPayload,
  basicTrackRowsToPayload as basicTrackRowsToPayloadFunc,
  TRACK_TYPES,
  ADVANCED_RELEASE_TYPES,
  PRICING_TIERS,
  DISTRIBUTION_PARTNERS
} from './csvValidation'

import {
  genreOptions,
  languageOptions,
  territoryOptions,
  partnerOptions as partnerOptionsRaw,
  vocalsPresentOptions,
  syncClearedOptions,
  masterRightsOptions,
  publishingRightsOptions
} from '@/constants/options'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

// Helper to slugify (Title Case -> snake_case)
const toSnakeCase = (str) => str?.toLowerCase().trim().replace(/ /g, '_').replace(/[^\w_]/g, '') || ''

// Helper to title case (snake_case -> Title Case)
const toTitleCase = (str) => str?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || ''

// Contributor Editor Modal for Arrays like contributorsSoundRecording
const ContributorEditor = ({ value, onChange, onClose, isDark }) => {
  // value is stringified JSON. Parse it if valid, otherwise empty array.
  let parsed = []
  try {
    if (value) parsed = JSON.parse(value)
  } catch (e) {
    parsed = []
  }
  const [contributors, setContributors] = useState(Array.isArray(parsed) ? parsed : [])

  const addContributor = () => {
    setContributors([...contributors, { name: '', role: '' }])
  }

  const removeContributor = (index) => {
    setContributors(contributors.filter((_, i) => i !== index))
  }

  const updateContributor = (index, field, val) => {
    const updated = [...contributors]
    updated[index][field] = val
    setContributors(updated)
  }

  const handleSave = () => {
    // Filter out empties
    const valid = contributors.filter(c => c.name.trim() && c.role.trim())
    onChange(valid.length > 0 ? JSON.stringify(valid) : '')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`w-[500px] max-w-[90vw] p-6 rounded-xl shadow-2xl ${isDark ? 'bg-[#1a2530] text-gray-200' : 'bg-white text-gray-900'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Edit Contributors</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-500/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto p-1">
          {contributors.map((c, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input
                placeholder="Name"
                value={c.name}
                onChange={(e) => updateContributor(i, 'name', e.target.value)}
                className={`flex-1 ${isDark ? 'bg-[#111a22] border-gray-700' : ''}`}
              />
              <Input
                placeholder="Role (e.g., Producer)"
                value={c.role}
                onChange={(e) => updateContributor(i, 'role', e.target.value)}
                className={`flex-1 ${isDark ? 'bg-[#111a22] border-gray-700' : ''}`}
              />
              <Button variant="ghost" size="icon" onClick={() => removeContributor(i)} className="text-red-400 hover:text-red-300">
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {contributors.length === 0 && (
            <p className="text-sm text-center py-4 opacity-50">No contributors added.</p>
          )}
        </div>

        <div className="mt-4 flex justify-between">
          <Button variant="outline" onClick={addContributor} className={isDark ? 'border-gray-700 hover:bg-gray-800' : ''}>
            + Add Contributor
          </Button>
          <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

const CellEditor = ({ value, onChange, header, isDark, sublabels }) => {
  // Determine Type
  let type = 'text'
  let options = []
  let isMulti = false
  const [isContributorModalOpen, setIsContributorModalOpen] = useState(false)
  
  if (['genre', 'primaryGenre', 'secondaryGenre'].includes(header)) {
    type = 'select'
    options = genreOptions
  } else if (['language'].includes(header)) {
    type = 'select'
    options = languageOptions
  } else if (['trackType'].includes(header)) {
    type = 'select'
    options = TRACK_TYPES.map(t => ({ value: t, label: toTitleCase(t) }))
  } else if (['releaseType'].includes(header)) {
    type = 'select'
    options = ADVANCED_RELEASE_TYPES.map(t => ({ value: t, label: toTitleCase(t) }))
  } else if (['releasePricingTier'].includes(header)) {
    type = 'select'
    options = PRICING_TIERS.map(t => ({ value: t, label: toTitleCase(t) }))
  } else if (['territories'].includes(header)) {
    type = 'multi-select'
    isMulti = true
    options = territoryOptions.map(t => ({ value: toSnakeCase(t), label: t }))
  } else if (['distributionPartners', 'partners'].includes(header)) {
    type = 'multi-select'
    isMulti = true
    options = DISTRIBUTION_PARTNERS.map(p => ({ value: p, label: toTitleCase(p) }))
  } else if (['hasRights', 'ownsCopyright', 'needsUPC', 'isWorldwide', 'ownsCopyrights', 'proceedWithoutCopyright', 'needsISRC', 'hasHumanVocals', 'isAvailableForDownload'].includes(header)) {
    type = 'select'
    options = [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }]
    // Normalize value if it's "1", "0", "Yes", "No"
    if (value) {
      const vStr = String(value).toLowerCase().trim()
      if (['yes', '1', 'true'].includes(vStr)) value = 'true'
      if (['no', '0', 'false'].includes(vStr)) value = 'false'
    }
  } else if (['contributorsSoundRecording', 'contributorsMusicalWork'].includes(header)) {
    type = 'contributor'
  } else if (['labelName'].includes(header)) {
    type = 'select'
    options = [{ value: 'Maheshwari Visuals', label: 'Maheshwari Visuals' }]
    if (sublabels && sublabels.length > 0) {
      sublabels.forEach(sl => {
        options.push({ value: sl.name, label: sl.name })
      })
    }
  }

  // --- Render Logic ---

  if (type === 'contributor') {
    let count = 0
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) count = parsed.length
    } catch (e) { count = 0 }

    return (
      <>
        <Button 
          variant="outline" 
          onClick={() => setIsContributorModalOpen(true)}
          className={`w-full min-w-[140px] h-8 text-xs ${isDark ? 'bg-[#111a22] border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700'}`}
        >
          {count > 0 ? `${count} Contributors` : 'Edit Contributors'}
        </Button>
        {isContributorModalOpen && (
          <ContributorEditor 
            value={value} 
            onChange={onChange} 
            onClose={() => setIsContributorModalOpen(false)}
            isDark={isDark}
          />
        )}
      </>
    )
  }

  if (type === 'select') {
    const match = options.find(o => o.value === value || String(o.value) === String(value))
    const displayValue = match ? match.value : (value || '')
    const isInvalid = value && !match

    return (
      <div className="flex items-center gap-1 group">
        <Select value={displayValue} onValueChange={(val) => onChange(val === '__clear__' ? '' : val)}>
          <SelectTrigger className={`w-[140px] h-8 text-xs ${isDark ? 'bg-[#111a22]' : 'bg-white'} ${isInvalid ? 'border-red-500 text-red-500' : (isDark ? 'border-gray-700' : 'border-gray-300')}`}>
            {isInvalid ? (
              <span className="truncate text-red-500 line-through opacity-80" title={`Invalid: ${value}`}>{value}</span>
            ) : (
              <SelectValue placeholder="Select..." />
            )}
          </SelectTrigger>
          <SelectContent className={isDark ? 'bg-[#1a2530] border-gray-700 text-gray-200' : 'bg-white'}>
             <div className="max-h-[200px] overflow-y-auto">
               <SelectItem value="__clear__" className="text-red-400 font-medium cursor-pointer">-- Clear Selection --</SelectItem>
               {options.map(opt => (
                  <SelectItem 
                    key={opt.value} 
                    value={opt.value} 
                    className={`text-xs cursor-pointer ${isDark ? 'focus:bg-gray-700 focus:text-gray-200' : ''}`}
                  >
                    {opt.label}
                  </SelectItem>
               ))}
             </div>
          </SelectContent>
        </Select>
        <div className="w-6 flex shrink-0 items-center justify-center">
          {value && (
            <button 
              onClick={(e) => { e.stopPropagation(); onChange('') }}
              className={`p-1 rounded-md transition-opacity ${isInvalid ? 'bg-red-100 dark:bg-red-900/30 text-red-600 hover:text-red-700' : 'opacity-0 group-hover:opacity-100 ' + (isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600')}`}
              title="Clear value"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    )
  }

  if (type === 'multi-select') {
    const selectedValues = value ? String(value).split('|').map(s => s.trim()).filter(Boolean) : []
    const validValues = selectedValues.filter(val => options.some(o => o.value === val))
    const invalidValues = selectedValues.filter(val => !options.some(o => o.value === val))
    const hasInvalid = invalidValues.length > 0
    
    return (
      <div className="flex items-center gap-1 group">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={`w-[140px] h-8 text-xs justify-between px-2 ${hasInvalid ? 'border-red-500 text-red-500' : (isDark ? 'bg-[#111a22] border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700')}`}>
              <span className="truncate pr-4">
                {selectedValues.length === 0 ? "Select..." : 
                  hasInvalid ? `${validValues.length} valid, ${invalidValues.length} err` : 
                  `${selectedValues.length} selected`}
              </span>
              <span className="opacity-50 text-[10px] shrink-0">▼</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className={`p-0 w-[240px] ${isDark ? 'bg-[#1a2530] border-gray-700' : 'bg-white'}`} align="start">
            <MultiSelectContent 
              options={options} 
              selectedValues={selectedValues} 
              invalidValues={invalidValues}
              onChange={(newValues) => onChange(newValues.join('|'))} 
              isDark={isDark}
            />
          </PopoverContent>
        </Popover>
        <div className="w-6 flex shrink-0 items-center justify-center">
          {hasInvalid && (
            <button 
              onClick={(e) => { e.stopPropagation(); onChange(validValues.join('|')) }}
              className={`p-1 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 hover:text-red-700`}
              title="Clear all invalid items"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    )
  }

  // Default Text Input
  return (
    <div className="flex items-center gap-1 group w-[170px]">
      <input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-[140px] min-w-[140px] px-2 py-1 flex-1 rounded text-sm border focus:ring-1 focus:ring-purple-500 outline-none transition-all ${isDark ? 'bg-[#111a22] border-gray-700 text-gray-200' : 'bg-white border-gray-300'}`}
      />
      <div className="w-6 flex shrink-0 items-center justify-center">
        {value && (
          <button
            onClick={() => onChange('')}
            className={`p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'}`}
            title="Clear value"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

const MultiSelectContent = ({ options, selectedValues, invalidValues = [], onChange, isDark }) => {
  const [search, setSearch] = useState('')
  const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))

  const toggle = (val) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter(v => v !== val))
    } else {
      onChange([...selectedValues, val])
    }
  }

  const removeInvalid = (val) => {
    onChange(selectedValues.filter(v => v !== val))
  }

  const handleSelectAll = () => {
    const validCurrentlySelected = selectedValues.filter(v => !invalidValues.includes(v))
    if (validCurrentlySelected.length === options.length) {
      // Deselect all valid
      onChange([...invalidValues])
    } else {
      // Select all valid
      onChange([...options.map(o => o.value), ...invalidValues])
    }
  }

  const handleClearAll = () => {
    onChange([])
  }

  const allValidSelected = options.length > 0 && 
    options.every(o => selectedValues.includes(o.value))

  return (
    <div className="flex flex-col max-h-[300px]">
      <div className={`p-2 border-b space-y-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <Input 
          placeholder="Search..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          className={`h-8 text-xs ${isDark ? 'bg-[#111a22] border-gray-600 text-gray-200 placeholder:text-gray-500' : 'bg-white border-gray-300'}`}
          autoFocus
        />
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleSelectAll} className="h-6 text-[10px] flex-1">
            {allValidSelected ? 'Deselect All' : 'Select All'}
          </Button>
          <Button variant="destructive" size="sm" onClick={handleClearAll} className="h-6 text-[10px] flex-1">
            Clear All
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-1">
        {/* Render Invalid Items First */}
        {invalidValues.length > 0 && (
          <div className={`mb-2 pb-2 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className="text-[10px] uppercase text-red-500 font-bold px-2 py-1">Invalid Items</p>
            {invalidValues.map(val => (
              <div 
                key={val} 
                className="flex items-center justify-between gap-2 p-1.5 rounded bg-red-500/10 text-red-500 text-xs mb-1 group"
              >
                <span className="truncate line-through opacity-80 pl-4">{val}</span>
                <button onClick={() => removeInvalid(val)} className="p-0.5 hover:bg-red-500/20 rounded">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Valid Options */}
        {filtered.length === 0 ? (
          <p className="text-xs text-center py-2 opacity-50">No results</p>
        ) : (
          filtered.map(opt => {
            const isSelected = selectedValues.includes(opt.value)
            return (
              <div 
                key={opt.value} 
                onClick={() => toggle(opt.value)}
                className={`flex items-center gap-2 p-1.5 rounded cursor-pointer text-xs ${isSelected ? (isDark ? 'bg-purple-900/40 text-purple-200' : 'bg-purple-100 text-purple-900 font-medium') : (isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')}`}
              >
                <div className={`w-3 h-3 rounded-sm border flex items-center justify-center shrink-0 ${isSelected ? 'bg-purple-600 border-purple-600' : 'border-gray-400'}`}>
                  {isSelected && <CheckCircle2 className="w-2 h-2 text-white" />}
                </div>
                <span className="truncate" title={opt.label}>{opt.label}</span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

const ACTIONS = [
  {
    id: 'create_basic',
    label: 'Create Basic Releases',
    description: 'Upload CSV with release metadata (Step 1 & Step 3)',
    icon: FileSpreadsheet,
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    id: 'create_advanced',
    label: 'Create Advanced Releases',
    description: 'Upload CSV with advanced release metadata',
    icon: Disc3,
    color: 'bg-purple-600 hover:bg-purple-700',
  },
  {
    id: 'upload_basic_tracks',
    label: 'Upload Basic Tracks',
    description: 'Add tracks to existing basic releases via CSV',
    icon: Music,
    color: 'bg-emerald-600 hover:bg-emerald-700',
  },
  {
    id: 'upload_advanced_tracks',
    label: 'Upload Advanced Tracks',
    description: 'Add tracks to existing advanced releases via CSV',
    icon: Music,
    color: 'bg-orange-600 hover:bg-orange-700',
  },
]

function getConfigForAction(actionId) {
  switch (actionId) {
    case 'create_basic':
      return {
        headers: BASIC_RELEASE_HEADERS,
        sample: BASIC_RELEASE_SAMPLE,
        validate: validateBasicReleaseRow,
        templateFilename: 'basic_release_template.csv',
      }
    case 'create_advanced':
      return {
        headers: ADVANCED_RELEASE_HEADERS,
        sample: ADVANCED_RELEASE_SAMPLE,
        validate: validateAdvancedReleaseRow,
        templateFilename: 'advanced_release_template.csv',
      }
    case 'upload_basic_tracks':
      return {
        headers: BASIC_TRACK_HEADERS,
        sample: BASIC_TRACK_SAMPLE,
        validate: validateBasicTrackRow,
        templateFilename: 'basic_track_template.csv',
      }
    case 'upload_advanced_tracks':
      return {
        headers: ADVANCED_TRACK_HEADERS,
        sample: ADVANCED_TRACK_SAMPLE,
        validate: validateAdvancedTrackRow,
        templateFilename: 'advanced_track_template.csv',
      }
    default:
      return null
  }
}

export default function CsvUploadModal({ isOpen, onClose, userId, userName, theme, onSuccess }) {
  const isDark = theme === 'dark'
  const [step, setStep] = useState('select') // select | upload | preview | executing | results
  const [selectedAction, setSelectedAction] = useState(null)
  const [parsedRows, setParsedRows] = useState([])
  const [validationErrors, setValidationErrors] = useState([])
  const [results, setResults] = useState([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  const resetState = useCallback(() => {
    setStep('select')
    setSelectedAction(null)
    setParsedRows([])
    setValidationErrors([])
    setResults([])
    setIsExecuting(false)
    setProgress({ current: 0, total: 0 })
  }, [])

  const handleClose = () => {
    resetState()
    onClose()
  }

  const handleActionSelect = (actionId) => {
    setSelectedAction(actionId)
    setStep('upload')
  }

  const handleDownloadTemplate = () => {
    const config = getConfigForAction(selectedAction)
    if (config) {
      downloadCsvTemplate(config.templateFilename, config.headers, config.sample)
      toast.success('Template downloaded!')
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file')
      return
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          toast.error(`CSV parsing errors: ${result.errors.map(e => e.message).join(', ')}`)
          return
        }

        if (result.data.length === 0) {
          toast.error('CSV file is empty')
          return
        }

        const config = getConfigForAction(selectedAction)
        const rows = result.data

        // Validate all rows
        const allErrors = []
        rows.forEach((row, idx) => {
          const rowErrors = config.validate(row, idx)
          allErrors.push(...rowErrors)
        })

        setParsedRows(rows)
        setValidationErrors(allErrors)
        setStep('preview')
      },
      error: (err) => {
        toast.error(`Failed to parse CSV: ${err.message}`)
      }
    })

    // Reset file input
    e.target.value = ''
  }

  const handleCellEdit = (rowIndex, field, value) => {
    const updated = [...parsedRows]
    updated[rowIndex] = { ...updated[rowIndex], [field]: value }
    setParsedRows(updated)

    // Re-validate
    const config = getConfigForAction(selectedAction)
    const allErrors = []
    updated.forEach((row, idx) => {
      const rowErrors = config.validate(row, idx)
      allErrors.push(...rowErrors)
    })
    setValidationErrors(allErrors)
  }

  const handleDeleteRow = (rowIndex) => {
    const updated = parsedRows.filter((_, i) => i !== rowIndex)
    setParsedRows(updated)

    // Re-validate
    const config = getConfigForAction(selectedAction)
    const allErrors = []
    updated.forEach((row, idx) => {
      const rowErrors = config.validate(row, idx)
      allErrors.push(...rowErrors)
    })
    setValidationErrors(allErrors)
  }

  const handleExecute = async () => {
    if (validationErrors.length > 0) {
      toast.error('Please fix all validation errors before proceeding')
      return
    }

    setIsExecuting(true)
    setStep('executing')
    const execResults = []

    if (selectedAction === 'create_basic') {
      setProgress({ current: 0, total: parsedRows.length })
      for (let i = 0; i < parsedRows.length; i++) {
        try {
          const payload = basicReleaseRowToPayload(parsedRows[i], userId)
          const res = await GlobalApi.createReleaseForUser(payload)
          execResults.push({
            row: i + 1,
            releaseName: parsedRows[i].releaseName,
            status: 'success',
            releaseId: res.data?.data?.releaseId || 'Created',
            message: res.data?.message || 'Success'
          })
        } catch (err) {
          execResults.push({
            row: i + 1,
            releaseName: parsedRows[i].releaseName,
            status: 'error',
            message: err.response?.data?.message || err.message || 'Failed'
          })
        }
        setProgress({ current: i + 1, total: parsedRows.length })
        setResults([...execResults])
      }
    } else if (selectedAction === 'create_advanced') {
      setProgress({ current: 0, total: parsedRows.length })
      for (let i = 0; i < parsedRows.length; i++) {
        try {
          const payload = advancedReleaseRowToPayload(parsedRows[i], userId)
          const res = await GlobalApi.createAdvancedReleaseForUser(payload)
          execResults.push({
            row: i + 1,
            releaseName: parsedRows[i].releaseName,
            status: 'success',
            releaseId: res.data?.data?.releaseId || 'Created',
            message: res.data?.message || 'Success'
          })
        } catch (err) {
          execResults.push({
            row: i + 1,
            releaseName: parsedRows[i].releaseName,
            status: 'error',
            message: err.response?.data?.message || err.message || 'Failed'
          })
        }
        setProgress({ current: i + 1, total: parsedRows.length })
        setResults([...execResults])
      }
    } else if (selectedAction === 'upload_basic_tracks') {
      // Group by releaseId
      const grouped = {}
      parsedRows.forEach(row => {
        const rid = row.releaseId?.trim()
        if (!grouped[rid]) grouped[rid] = []
        grouped[rid].push(row)
      })
      const groups = Object.entries(grouped)
      setProgress({ current: 0, total: groups.length })

      for (let i = 0; i < groups.length; i++) {
        const [releaseId, rows] = groups[i]
        try {
          const payload = basicTrackRowsToPayload(rows)
          await GlobalApi.editRelease(releaseId, payload)
          execResults.push({
            row: i + 1,
            releaseName: `${releaseId} (${rows.length} tracks)`,
            status: 'success',
            releaseId,
            message: `${rows.length} track(s) added`
          })
        } catch (err) {
          execResults.push({
            row: i + 1,
            releaseName: `${releaseId} (${rows.length} tracks)`,
            status: 'error',
            message: err.response?.data?.message || err.message || 'Failed'
          })
        }
        setProgress({ current: i + 1, total: groups.length })
        setResults([...execResults])
      }
    } else if (selectedAction === 'upload_advanced_tracks') {
      const grouped = {}
      parsedRows.forEach(row => {
        const rid = row.releaseId?.trim()
        if (!grouped[rid]) grouped[rid] = []
        grouped[rid].push(row)
      })
      const groups = Object.entries(grouped)
      setProgress({ current: 0, total: groups.length })

      for (let i = 0; i < groups.length; i++) {
        const [releaseId, rows] = groups[i]
        try {
          const payload = advancedTrackRowsToPayload(rows)
          await GlobalApi.editAdvancedRelease(releaseId, payload)
          execResults.push({
            row: i + 1,
            releaseName: `${releaseId} (${rows.length} tracks)`,
            status: 'success',
            releaseId,
            message: `${rows.length} track(s) added`
          })
        } catch (err) {
          execResults.push({
            row: i + 1,
            releaseName: `${releaseId} (${rows.length} tracks)`,
            status: 'error',
            message: err.response?.data?.message || err.message || 'Failed'
          })
        }
        setProgress({ current: i + 1, total: groups.length })
        setResults([...execResults])
      }
    }

    setIsExecuting(false)
    setStep('results')

    const successCount = execResults.filter(r => r.status === 'success').length
    const failCount = execResults.filter(r => r.status === 'error').length

    if (failCount === 0) {
      toast.success(`All ${successCount} operations completed successfully!`)
    } else {
      toast.warning(`${successCount} succeeded, ${failCount} failed`)
    }

    if (successCount > 0 && onSuccess) {
      onSuccess()
    }
  }

  if (!isOpen) return null

  const config = selectedAction ? getConfigForAction(selectedAction) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden ${isDark ? 'bg-[#151F28] text-gray-200' : 'bg-white text-gray-800'}`}>

        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div>
            <h2 className="text-xl font-semibold">
              {step === 'select' && 'Upload Catalog'}
              {step === 'upload' && ACTIONS.find(a => a.id === selectedAction)?.label}
              {step === 'preview' && 'Preview & Validate'}
              {step === 'executing' && 'Creating Releases...'}
              {step === 'results' && 'Upload Results'}
            </h2>
            {userName && <p className={`text-sm mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>For user: {userName}</p>}
          </div>
          <button onClick={handleClose} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* STEP: Select Action */}
          {step === 'select' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACTIONS.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.id}
                    onClick={() => handleActionSelect(action.id)}
                    className={`p-6 rounded-xl border text-left transition-all hover:scale-[1.02] hover:shadow-lg ${isDark ? 'border-gray-700 hover:border-gray-500 bg-[#1a2530]' : 'border-gray-200 hover:border-gray-400 bg-gray-50'}`}
                  >
                    <div className={`inline-flex p-3 rounded-lg ${action.color} text-white mb-3`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{action.label}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{action.description}</p>
                  </button>
                )
              })}
            </div>
          )}

          {/* STEP: Upload CSV */}
          {step === 'upload' && (
            <div className="flex flex-col items-center gap-6 py-8">
              <div className={`w-full max-w-md p-8 rounded-xl border-2 border-dashed text-center ${isDark ? 'border-gray-600 bg-[#1a2530]' : 'border-gray-300 bg-gray-50'}`}>
                <Upload className={`h-12 w-12 mx-auto mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <p className="text-lg font-medium mb-2">Upload CSV File</p>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Select a CSV file with the correct headers
                </p>
                <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />
                  Choose File
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <Button
                variant="outline"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download CSV Template
              </Button>

              <Button variant="ghost" onClick={() => { setSelectedAction(null); setStep('select') }}>
                ← Back to options
              </Button>
            </div>
          )}

          {/* STEP: Preview */}
          {step === 'preview' && config && (
            <div className="space-y-4">
              {/* Validation Summary */}
              {validationErrors.length > 0 ? (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <span className="font-semibold text-red-400">{validationErrors.length} validation error(s)</span>
                  </div>
                  <ul className="text-sm text-red-300 space-y-1 max-h-32 overflow-y-auto">
                    {validationErrors.map((err, i) => (
                      <li key={i}>• {err}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="font-semibold text-green-400">All {parsedRows.length} row(s) validated successfully</span>
                  </div>
                </div>
              )}

              {/* Preview Table */}
              <div className="overflow-x-auto rounded-lg border" style={{ maxHeight: '400px' }}>
                <table className="table-auto text-sm w-full">
                  <thead className={`sticky top-0 ${isDark ? 'bg-[#1a2530] text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">#</th>
                      {config.headers.map(h => (
                        <th key={h} className="px-3 py-2 text-left font-medium whitespace-nowrap">{h}</th>
                      ))}
                      <th className="px-3 py-2 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.map((row, rowIdx) => {
                      const rowHasError = validationErrors.some(e => e.startsWith(`Row ${rowIdx + 1}:`))
                      return (
                        <tr
                          key={rowIdx}
                          className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} ${rowHasError ? (isDark ? 'bg-red-900/10' : 'bg-red-50') : ''}`}
                        >
                          <td className="px-3 py-2 font-mono text-xs">{rowIdx + 1}</td>
                          {config.headers.map(h => (
                            <td key={h} className="px-1 py-1">
                              <CellEditor
                                value={row[h]}
                                onChange={(val) => handleCellEdit(rowIdx, h, val)}
                                header={h}
                                isDark={isDark}
                              />
                            </td>
                          ))}
                          <td className="px-3 py-2">
                            <button
                              onClick={() => handleDeleteRow(rowIdx)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                💡 You can edit cells directly in the table above. Click "Remove" to delete a row.
              </p>
            </div>
          )}

          {/* STEP: Executing */}
          {step === 'executing' && (
            <div className="flex flex-col items-center gap-6 py-12">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
              <div className="text-center">
                <p className="text-lg font-semibold">Processing releases...</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {progress.current} of {progress.total} completed
                </p>
              </div>
              {/* Progress bar */}
              <div className="w-full max-w-md h-3 rounded-full bg-gray-700 overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
                />
              </div>

              {/* Live results */}
              {results.length > 0 && (
                <div className="w-full max-w-lg max-h-48 overflow-y-auto space-y-1 mt-4">
                  {results.map((r, i) => (
                    <div key={i} className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded ${r.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                      {r.status === 'success' ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" /> : <AlertCircle className="h-4 w-4 flex-shrink-0" />}
                      <span className="truncate">{r.releaseName}: {r.status === 'success' ? r.releaseId : r.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP: Results */}
          {step === 'results' && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                  <p className="text-3xl font-bold text-green-400">{results.filter(r => r.status === 'success').length}</p>
                  <p className="text-sm text-green-400 mt-1">Successful</p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                  <p className="text-3xl font-bold text-red-400">{results.filter(r => r.status === 'error').length}</p>
                  <p className="text-sm text-red-400 mt-1">Failed</p>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="overflow-x-auto rounded-lg border" style={{ maxHeight: '350px' }}>
                <table className="table-auto text-sm w-full">
                  <thead className={`sticky top-0 ${isDark ? 'bg-[#1a2530] text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                    <tr>
                      <th className="px-4 py-2 text-left">#</th>
                      <th className="px-4 py-2 text-left">Release</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i} className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <td className="px-4 py-2">{r.row}</td>
                        <td className="px-4 py-2 font-medium">{r.releaseName}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${r.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {r.status === 'success' ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                            {r.status === 'success' ? 'Success' : 'Failed'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {r.status === 'success' ? `Release ID: ${r.releaseId}` : r.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between px-6 py-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div>
            {step === 'preview' && (
              <Button variant="ghost" onClick={() => setStep('upload')}>
                ← Re-upload CSV
              </Button>
            )}
            {step === 'results' && (
              <Button variant="ghost" onClick={resetState}>
                ← Upload Another
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              {step === 'results' ? 'Close' : 'Cancel'}
            </Button>
            {step === 'preview' && (
              <Button
                onClick={handleExecute}
                disabled={validationErrors.length > 0 || parsedRows.length === 0}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {selectedAction?.startsWith('create') ? `Create ${parsedRows.length} Release(s)` : `Upload Tracks for ${parsedRows.length} Row(s)`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
