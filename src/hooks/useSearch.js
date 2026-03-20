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
}