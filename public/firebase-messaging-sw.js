importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCxTYSm_mXBuwOJ7mFxpR5k8HO1i2BrD5w",
  authDomain: "thinking-digit-368121.firebaseapp.com",
  projectId: "thinking-digit-368121",
  storageBucket: "thinking-digit-368121.appspot.com",
  messagingSenderId: "872224361329",
  appId: "1:872224361329:web:8fb83a40fc8ae9a689c4d0",
  measurementId: "G-E6Y0P339GJ",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
// Customize background notification handling here
messaging.onBackgroundMessage((payload) => {
  console.log("Background Message:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
