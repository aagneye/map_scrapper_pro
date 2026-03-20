import { useState } from 'react';
import { fetchOCMPlaces, fetchOSMPlaces, geocodeCity } from '../utils/api.js';
import { parseOCMResults, parseOSMResults } from '../utils/parser.js';
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
    if (!city.trim()) {
      setErrorMessage('Please enter a city name.');
      setStatusMessage('');
      setSearchDone(false);
      return;
    }

    const category = CATEGORIES[selectedCategory];

    setLoading(true);
    setErrorMessage('');
    setResults([]);
    setSearchDone(false);
    setStatusMessage('📍 Locating city...');

    try {
      const info = await geocodeCity(city.trim());
      setCityInfo(info);

      let nextResults = [];

      if (category.useOCM) {
        setStatusMessage('⚡ Fetching OpenChargeMap results...');
        const ocmData = await fetchOCMPlaces(info.lat, info.lon, radius);
        const ocmResults = parseOCMResults(ocmData, category.label);

        setStatusMessage('🗺️ Fetching OpenStreetMap results...');
        const osmData = await fetchOSMPlaces(
          category.osmTag,
          category.osmValue,
          info.lat,
          info.lon,
          radius,
        );
        const osmResults = parseOSMResults(osmData, category.label);

        nextResults = [...osmResults, ...ocmResults];
      } else {
        setStatusMessage('🗺️ Fetching OpenStreetMap results...');
        const osmData = await fetchOSMPlaces(
          category.osmTag,
          category.osmValue,
          info.lat,
          info.lon,
          radius,
        );
        nextResults = parseOSMResults(osmData, category.label);
      }

      setResults(nextResults);
      setSearchDone(true);
      setStatusMessage(`✅ Found ${nextResults.length} results in ${info.displayName}`);
    } catch (error) {
      setStatusMessage('');
      setErrorMessage(error instanceof Error ? error.message : 'Search failed. Please try again.');
      setSearchDone(true);
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
