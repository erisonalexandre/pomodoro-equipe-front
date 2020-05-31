importScripts('sw.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js')

let config = {
  messagingSenderId: "740024813075"
};

firebase.initializeApp(config);

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(function (payload) {
  return self.registration.showNotification({}, {});
})
