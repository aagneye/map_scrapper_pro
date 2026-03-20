import { useState } from 'react'
import * as XLSX from 'xlsx'

type PlaceRow = {
  name: string
  address: string
  latitude: number
  longitude: number
  phone: string
  website: string
  rating: number | null
  reviews: number
  ports: number | null
  connectors: string
  openingHours: string
  category: string
  source: 'OpenStreetMap' | 'OpenChargeMap'
}

type CategoryPreset = {
  id: string
  label: string
  osmTag: string
  osmValue: string
}

const categoryPresets: CategoryPreset[] = [
  { id: 'ev', label: '⚡ EV Charging Stations', osmTag: 'amenity', osmValue: 'charging_station' },
  { id: 'restaurant', label: '🍽️ Restaurants', osmTag: 'amenity', osmValue: 'restaurant' },
  { id: 'cafe', label: '☕ Cafés', osmTag: 'amenity', osmValue: 'cafe' },
  { id: 'hotel', label: '🏨 Hotels', osmTag: 'tourism', osmValue: 'hotel' },
  { id: 'hospital', label: '🏥 Hospitals', osmTag: 'amenity', osmValue: 'hospital' },
  { id: 'fuel', label: '⛽ Petrol Stations', osmTag: 'amenity', osmValue: 'fuel' },
  { id: 'bank', label: '🏦 Banks', osmTag: 'amenity', osmValue: 'bank' },
  { id: 'supermarket', label: '🛒 Supermarkets', osmTag: 'shop', osmValue: 'supermarket' },
  { id: 'pharmacy', label: '💊 Pharmacies', osmTag: 'amenity', osmValue: 'pharmacy' },
  { id: 'school', label: '🎓 Schools', osmTag: 'amenity', osmValue: 'school' },
  { id: 'custom', label: 'Custom OSM tag', osmTag: '', osmValue: '' }
]

const radiusOptions = [1, 2, 5, 10, 20, 50]

const composeAddressFromOSM = (tags: Record<string, any>): string => {
  const parts = ['addr:housenumber', 'addr:street', 'addr:city', 'addr:postcode', 'addr:state', 'addr:country']
    .map((key) => tags[key])
    .filter(Boolean)
  return parts.join(', ')
}

const composeAddressFromOCM = (info: any): string => {
  if (!info) return ''
  const parts = [info.AddressLine1, info.AddressLine2, info.Town, info.StateOrProvince, info.Postcode, info.Country?.Title].filter(Boolean)
  return parts.join(', ')
}

const getCoordsKey = (lat: number, lon: number) => `${lat.toFixed(6)}|${lon.toFixed(6)}`

function App() {
  const [city, setCity] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryPreset>(categoryPresets[0])
  const [customTagKey, setCustomTagKey] = useState('')
  const [customTagValue, setCustomTagValue] = useState('')
  const [radius, setRadius] = useState(5)
  const [places, setPlaces] = useState<PlaceRow[]>([])
  const [status, setStatus] = useState('Ready')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchCityCoordinates = async (query: string): Promise<{ latitude: number; longitude: number; displayName: string }> => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
    const response = await fetch(url, { headers: { 'Accept-Language': 'en' } })
    if (!response.ok) {
      throw new Error('Nominatim request failed')
    }
    const data = await response.json()
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('City not found')
    }
    const first = data[0]
    return { latitude: parseFloat(first.lat), longitude: parseFloat(first.lon), displayName: first.display_name }
  }

  const fetchOpenStreetMap = async (lat: number, lon: number, tagKey: string, tagValue: string, radiusKm: number): Promise<PlaceRow[]> => {
    setStatus('🗺️ Fetching from OpenStreetMap...')
    const query = `[out:json][timeout:30];node["${tagKey}"="${tagValue}"](around:${radiusKm * 1000},${lat},${lon});out tags;`
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: `data=${encodeURIComponent(query)}`
    })

    if (!response.ok) {
      throw new Error('Overpass API failed')
    }

    const data = await response.json()
    const elements = data.elements || []
    return elements
      .filter((item: any) => item.tags)
      .map((item: any) => {
        const tags = item.tags || {}
        const name = tags.name || ''
        return {
          name,
          address: composeAddressFromOSM(tags),
          latitude: Number(item.lat) || 0,
          longitude: Number(item.lon) || 0,
          phone: tags.phone || tags['contact:phone'] || '',
          website: tags.website || tags.url || '',
          rating: null,
          reviews: 0,
          ports: tags.capacity ? Number(tags.capacity) : null,
          connectors: '',
          openingHours: tags.opening_hours || '',
          category: selectedCategory.label,
          source: 'OpenStreetMap' as const
        }
      })
  }

  const fetchOpenChargeMap = async (lat: number, lon: number, radiusKm: number): Promise<PlaceRow[]> => {
    setStatus('⚡ Fetching from OpenChargeMap...')
    const url = `https://api.openchargemap.io/v3/poi/?output=json&latitude=${lat}&longitude=${lon}&distance=${radiusKm}&distanceunit=KM&maxresults=500`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('OpenChargeMap API failed')
    }

    const data = await response.json()
    if (!Array.isArray(data)) return []

    return data.map((item: any) => {
      const comments = Array.isArray(item.UserComments) ? item.UserComments : []
      const ratings = comments.map((c: any) => Number(c.Rating || 0)).filter((r: number) => r > 0)
      const rating = ratings.length === 0 ? null : ratings.reduce((acc: number, v: number) => acc + v, 0) / ratings.length
      const connections = Array.isArray(item.Connections) ? item.Connections : []
      const connectorTypes = connections.map((c: any) => c.ConnectionType?.Title).filter(Boolean)
      return {
        name: item.AddressInfo?.Title || 'EV charging station',
        address: composeAddressFromOCM(item.AddressInfo),
        latitude: Number(item.AddressInfo?.Latitude) || lat,
        longitude: Number(item.AddressInfo?.Longitude) || lon,
        phone: item.AddressInfo?.ContactTelephone1 || '',
        website: item.AddressInfo?.RelatedURL || '',
        rating,
        reviews: comments.length,
        ports: connections.length || null,
        connectors: Array.from(new Set(connectorTypes)).join(', '),
        openingHours: '',
        category: '⚡ EV Charging Stations',
        source: 'OpenChargeMap' as const
      }
    })
  }

  const deduplicatePlaces = (rows: PlaceRow[]): PlaceRow[] => {
    const map = new Map<string, PlaceRow>()
    for (const row of rows) {
      const key = `${getCoordsKey(row.latitude, row.longitude)}|${row.name}`
      if (!map.has(key)) {
        map.set(key, row)
      }
    }
    return Array.from(map.values())
  }

  const handleSearch = async () => {
    setError(null)
    if (!city.trim()) {
      setError('Please enter a city name')
      return
    }

    const osmTagKey = selectedCategory.id === 'custom' ? customTagKey.trim() : selectedCategory.osmTag
    const osmTagValue = selectedCategory.id === 'custom' ? customTagValue.trim() : selectedCategory.osmValue
    if (!osmTagKey || !osmTagValue) {
      setError('Please specify custom OSM tag and value')
      return
    }

    try {
      setIsLoading(true)
      setStatus('📍 Locating city...')
      const location = await fetchCityCoordinates(city)

      const osmResults = await fetchOpenStreetMap(location.latitude, location.longitude, osmTagKey, osmTagValue, radius)
      let results: PlaceRow[] = osmResults

      if (selectedCategory.id === 'ev') {
        const ocmResults = await fetchOpenChargeMap(location.latitude, location.longitude, radius)
        results = [...osmResults, ...ocmResults]
      }

      const deduped = deduplicatePlaces(results)
      setPlaces(deduped)
      setStatus(`✅ Found ${deduped.length} results in ${location.displayName}`)
    } catch (err: any) {
      setError(err?.message ?? 'An unknown error occurred')
      setStatus('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    if (!places.length) {
      setError('No results to export')
      return
    }

    const dateTag = new Date().toISOString().split('T')[0]
    const fileName = `${city.replace(/\s+/g, '_')}_${selectedCategory.id}_${dateTag}.xlsx`
    const headers = ['#', 'Name', 'Address', 'Latitude', 'Longitude', 'Phone', 'Website', 'Rating', 'Reviews Count', 'Number of Ports', 'Connector Types', 'Opening Hours', 'Category', 'Source']

    const sheetData = places.map((place, idx) => ({
      '#': idx + 1,
      Name: place.name,
      Address: place.address,
      Latitude: place.latitude,
      Longitude: place.longitude,
      Phone: place.phone,
      Website: place.website,
      Rating: place.rating ?? '',
      'Reviews Count': place.reviews,
      'Number of Ports': place.ports ?? '',
      'Connector Types': place.connectors,
      'Opening Hours': place.openingHours,
      Category: place.category,
      Source: place.source
    }))

    const ws = XLSX.utils.json_to_sheet(sheetData, { header: headers })

    headers.forEach((label, index) => {
      const address = XLSX.utils.encode_cell({ c: index, r: 0 })
      const cell = ws[address] || {}
      cell.t = 's'
      cell.v = label
      cell.s = {
        font: { bold: true, color: { rgb: 'FFFFFFFF' } },
        fill: { patternType: 'solid', fgColor: { rgb: 'FF1E3A5F' } }
      }
      ws[address] = cell
    })

    const maxWidths = headers.map((h) => ({ wch: h.length + 2 }))
    for (const row of sheetData) {
      headers.forEach((h, idx) => {
        const value = String((row as any)[h] ?? '')
        const len = value.length + 2
        if (maxWidths[idx].wch < len) {
          maxWidths[idx].wch = len
        }
      })
    }
    ws['!cols'] = maxWidths
    ws['!freeze'] = { xSplit: 0, ySplit: 1 }

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'PlaceMapper Data')
    XLSX.writeFile(wb, fileName)
  }

  return (
    <div className="min-h-screen bg-bg text-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-xl border border-bord bg-card p-4 md:p-6 shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-white">PlaceMapper Pro</h1>
          <p className="text-sm text-slate-300">100% free, no API keys required. Supports OpenStreetMap, OpenChargeMap, Nominatim.</p>
        </header>

        <section className="rounded-xl border border-bord bg-card p-4 md:p-6">
          <div className="flex flex-wrap gap-2">
            {categoryPresets.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedCategory.id === cat.id ? 'bg-gradient-to-r from-accentFrom to-accentTo text-black' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City name (e.g., Amsterdam)"
              className="rounded-lg border border-bord bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            {selectedCategory.id === 'custom' ? (
              <div className="grid grid-cols-2 gap-2">
                <input
                  value={customTagKey}
                  onChange={(e) => setCustomTagKey(e.target.value)}
                  placeholder="OSM tag key (e.g., amenity)"
                  className="rounded-lg border border-bord bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  value={customTagValue}
                  onChange={(e) => setCustomTagValue(e.target.value)}
                  placeholder="OSM tag value (e.g., library)"
                  className="rounded-lg border border-bord bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            ) : (
              <div className="rounded-lg border border-bord bg-slate-900 px-3 py-2 text-sm text-slate-300">Using OSM filter: {selectedCategory.osmTag}={selectedCategory.osmValue}</div>
            )}

            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="rounded-lg border border-bord bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {radiusOptions.map((r) => (
                <option key={r} value={r}>{r} km</option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button onClick={handleSearch} className="rounded-lg bg-gradient-to-r from-accentFrom to-accentTo px-4 py-2 font-bold text-black shadow">Search</button>
            <button onClick={handleExport} disabled={!places.length} className="rounded-lg border border-bord px-4 py-2 text-slate-200 hover:bg-slate-800 disabled:opacity-50">⬇️ Export to Excel</button>
            <div className="text-sm text-slate-300">{status}</div>
            {isLoading && <div className="text-sm text-cyan-400">Loading...</div>}
          </div>

          {error && <div className="mt-3 rounded-lg border border-red-400 bg-red-950/60 px-3 py-2 text-sm text-red-300">{error}</div>}

          <div className="mt-3 text-sm text-slate-200">Found {places.length} rows{city ? ` in ${city}` : ''}</div>
        </section>

        <section className="rounded-xl border border-bord bg-card p-4 md:p-6">
          <div className="table-scroll max-h-[60vh] overflow-y-auto rounded-md border border-bord">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="sticky-header bg-slate-900 text-slate-100">
                <tr>
                  {['#', 'Name', 'Address', 'Lat', 'Lon', 'Phone', 'Website', 'Rating', 'Reviews', 'Ports', 'Connectors', 'Hours', 'Category', 'Source'].map((heading) => (
                    <th key={heading} className="border-b border-bord px-2 py-2 font-semibold">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {places.length === 0 ? (
                  <tr><td colSpan={14} className="px-2 py-4 text-center text-slate-400">No results yet</td></tr>
                ) : (
                  places.map((place, idx) => (
                    <tr key={`${place.latitude}-${place.longitude}-${idx}`} className={idx % 2 === 0 ? 'bg-slate-900/60' : 'bg-slate-900'}>
                      <td className="px-2 py-1">{idx + 1}</td>
                      <td className="px-2 py-1 truncate-text" title={place.name}>{place.name || '-'}</td>
                      <td className="px-2 py-1 truncate-text" title={place.address}>{place.address || '-'}</td>
                      <td className="px-2 py-1">{place.latitude.toFixed(6)}</td>
                      <td className="px-2 py-1">{place.longitude.toFixed(6)}</td>
                      <td className="px-2 py-1">{place.phone || '-'}</td>
                      <td className="px-2 py-1">
                        {place.website ? <a href={place.website} target="_blank" rel="noreferrer" className="text-cyan-300">🔗 Link</a> : '-'}
                      </td>
                      <td className="px-2 py-1">{place.rating !== null ? place.rating.toFixed(1) : '-'}</td>
                      <td className="px-2 py-1">{place.reviews}</td>
                      <td className="px-2 py-1">{place.ports ?? '-'}</td>
                      <td className="px-2 py-1 truncate-text" title={place.connectors}>{place.connectors || '-'}</td>
                      <td className="px-2 py-1 truncate-text" title={place.openingHours}>{place.openingHours || '-'}</td>
                      <td className="px-2 py-1">{place.category}</td>
                      <td className="px-2 py-1">
                        <span className={place.source === 'OpenChargeMap' ? 'badge-ocm rounded-full px-2 py-0.5 text-xs' : 'badge-osm rounded-full px-2 py-0.5 text-xs'}>{place.source}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="rounded-xl border border-bord bg-card p-4 text-xs text-slate-400">
          <p>Data sources: OpenStreetMap (© OpenStreetMap contributors), OpenChargeMap (open community EV data), Nominatim (geocoding).</p>
          <p>100% free — no API keys required.</p>
        </footer>

      </div>
    </div>
  )
}

export default App
