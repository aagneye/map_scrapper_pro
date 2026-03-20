import { useState } from 'react';
import { geocodeCity, fetchOSMPlaces, fetchOCMPlaces } from '../utils/api.js';
import { parseOSMResults, parseOCMResults } from '../utils/parser.js';
import { CATEGORIES } from '../constants/index.js';