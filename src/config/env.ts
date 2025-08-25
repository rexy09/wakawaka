const env = import.meta.env;
const Env = {
  baseURL: env.VITE_BASE_URL,
  FIREBASE_API_KEY: env.VITE_FIREBASE_API,
  APP_VAPID_KEY: env.VITE_APP_VAPID_KEY,
  googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
  isProduction: env.VITE_NODE_ENV === "production",
  ALGOLIA_APP_ID: env.VITE_ALGOLIA_APP_ID,
  ALGOLIA_SEARCH_KEY: env.VITE_ALGOLIA_SEARCH_KEY,
  ALGOLIA_INDEX_NAME: env.VITE_ALGOLIA_INDEX_NAME,
};

export default Env;
