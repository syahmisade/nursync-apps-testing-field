import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// Local dev: authenticate directly against the hosted Base44 backend using an
// app API key (set VITE_BASE44_API_KEY in .env.local). When absent, keep the
// original embedded/hosted behavior (empty serverUrl + dev proxy + user token).
const apiKey = import.meta.env.VITE_BASE44_API_KEY;

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: apiKey ? 'https://base44.app' : '',
  requiresAuth: false,
  appBaseUrl,
  ...(apiKey ? { headers: { api_key: apiKey } } : {}),
});
