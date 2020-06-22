importScripts('sw.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js')
importScripts('localforage.js')

let config = {
  messagingSenderId: "740024813075"
};

firebase.initializeApp(config);

const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(function ({data}) {
  localforage.setDriver([
    localforage.INDEXEDDB,
    localforage.WEBSQL,
    localforage.LOCALSTORAGE
  ]).then(function() {
    localforage.getItem('user-id').then(function(readValue) {
      if (data.user === readValue) {
        return self.registration.showNotification(data.title, {body: data.body});
      }
    })
  })
})
