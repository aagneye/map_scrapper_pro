import { useState } from 'react';
import { geocodeCity, fetchOSMPlaces, fetchOCMPlaces } from '../utils/api.js';
import { parseOSMResults, parseOCMResults } from '../utils/parser.js';
import { CATEGORIES } from '../constants/index.js';

export function useSearch() {
  const [city, setCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [radius, setRadius] = useState(5000);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchDone, setSearchDone] = useState(false);
  const [cityInfo, setCityInfo] = useState(null);

  const handleSearch = async () => {
    // Validate city not empty
    if (!city.trim()) {
      setErrorMessage('Please enter a city name.');
      return;
    }

    // Clear previous state
    setLoading(true);
    setErrorMessage('');
    setResults([]);
    setSearchDone(false);
    setStatusMessage('📍 Locating city...');

    try {
      // Geocode city
      const info = await geocodeCity(city);
      setCityInfo(info);

      const category = CATEGORIES[selectedCategory];
      let allResults = [];

      if (category.useOCM) {
        // Fetch from OCM
        setStatusMessage('⚡ Fetching from OpenChargeMap...');
        const ocmData = await fetchOCMPlaces(info.lat, info.lon, radius);
        const ocmResults = parseOCMResults(ocmData);

        // Also fetch from OSM
        setStatusMessage('🗺️ Also fetching from OpenStreetMap...');
        const osmData = await fetchOSMPlaces(category.tags, info.lat, info.lon, radius);
        const osmResults = parseOSMResults(osmData);

        // Merge
        allResults = [...osmResults, ...ocmResults];
      } else {
        // Fetch from OSM only
        setStatusMessage('🗺️ Fetching from OpenStreetMap...');
        const osmData = await fetchOSMPlaces(category.tags, info.lat, info.lon, radius);
        allResults = parseOSMResults(osmData);
      }

      // Set results
      setResults(allResults);
      setSearchDone(true);
      setStatusMessage(`✅ Found ${allResults.length} results in ${city}`);
    } catch (e) {
      setErrorMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    city,
    setCity,
    selectedCategory,
    setSelectedCategory,
    radius,
    setRadius,
    results,
    loading,
    statusMessage,
    errorMessage,
    searchDone,
    cityInfo,
    handleSearch,
  };
}