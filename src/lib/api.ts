/**
 * src/lib/api.ts
 * Centralized API client for communicating with the PHP backend.
 */

const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const config = {
    ...options,
    headers,
    credentials: 'include' as RequestCredentials,
  };

  try {
    const response = await fetch(url, config);
    const text = await response.text();
    
    // Check for InfinityFree Security Challenge (AES challenge)
    if (text.includes("aes.js") || text.includes("__test")) {
      console.warn('InfinityFree Security Challenge detected. Auto-refreshing...');
      window.location.reload(); 
      throw new Error('Security challenge active. Page is reloading...');
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON. Raw response:', text);
      throw new Error('Server returned invalid response. Check console for details.');
    }
    
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    
    return data;
  } catch (error: any) {
    console.error('API Request Error:', error);
    throw error;
  }
}


export const api = {
  // Helpers
  getAssetUrl: (path: string) => {
    if (!path) return '';
    if (path.startsWith('data:') || path.startsWith('http')) return path;
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    const cleanBase = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    return `${cleanBase}/${cleanPath}`;
  },

  // Auth
  login: (credentials: any) => request('/login.php', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  // Agenda
  getAgendas: () => request('/agenda.php'),
  saveAgenda: (data: any) => request('/agenda.php', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteAgenda: (id: number) => request(`/agenda.php?id=${id}`, {
    method: 'DELETE',
  }),

  // Informasi
  getInformasi: () => request('/sertifikat.php'),
  uploadInformasi: (formData: FormData) => request('/sertifikat.php', {
    method: 'POST',
    body: formData,
  }),
  deleteInformasi: (id: number) => request(`/sertifikat.php?id=${id}`, {
    method: 'DELETE',
  }),

  // KGB Pegawai
  getKGBEmployees: () => request('/kgb_pegawai.php'),
  addKGBEmployee: (data: any) => request('/kgb_pegawai.php', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateKGBEmployee: (data: any) => request('/kgb_pegawai.php', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteKGBEmployee: (id: number) => request(`/kgb_pegawai.php?id=${id}`, {
    method: 'DELETE',
  }),

  // KGB Riwayat
  getKGBHistory: () => request('/kgb_riwayat.php'),
  addKGBHistory: (data: any) => request('/kgb_riwayat.php', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteKGBHistory: (ids: number[]) => request(`/kgb_riwayat.php?ids=${ids.join(',')}`, {
    method: 'DELETE',
  }),
  bulkUpdateKGBEmployees: (records: any[]) => request('/kgb_pegawai.php', {
    method: 'PATCH',
    body: JSON.stringify({ records }),
  }),
};
