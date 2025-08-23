const env = import.meta.env;
const Env = {
  baseURL: env.VITE_BASE_URL,
  FIREBASE_API_KEY: env.VITE_FIREBASE_API,
  APP_VAPID_KEY: env.VITE_APP_VAPID_KEY,
  googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
  isProduction: env.VITE_NODE_ENV === "production",
  ALGOLIA_APP_ID: "08RG3MRF3H",
  ALGOLIA_SEARCH_KEY: "d2450095b7823e48641cc1572f79c81d",
  ALGOLIA_INDEX_NAME: "jobPosts",
};

export default Env;
