/**
 * API Configuration
 * Change the BASE_URL here to update it across the entire application
 */

// Base URL (without /api suffix)
// For development with dynamic hostname
// export const BASE_URL = `http://${window.location.hostname}:5090`;

// For development with localhost
export const BASE_URL = 'https://localhost:7211';

// For production
// export const BASE_URL = 'https://your-production-domain.com';

// API endpoint URL
export const API_BASE_URL = `${BASE_URL}/api`;
