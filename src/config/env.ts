const env = import.meta.env;
const Env = {
  baseURL: env.VITE_BASE_URL,
  FIREBASE_API_KEY: env.VITE_FIREBASE_API,
  APP_VAPID_KEY: env.VITE_APP_VAPID_KEY,
  googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
  isProduction: env.VITE_NODE_ENV === "production",
};

export default Env;
